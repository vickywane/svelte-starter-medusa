
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update$1(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update$1($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind$1(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.44.1 */

    function create_fragment$q(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.44.1 */

    const get_default_slot_changes$1 = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context$1 = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$6, create_else_block$b];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$b(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$b.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.44.1 */
    const file$m = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$o(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$m, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/checkoutStage.svelte generated by Svelte v3.44.1 */

    const file$l = "src/components/checkoutStage.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (8:2) {#each stages as stage}
    function create_each_block$8(ctx) {
    	let p;
    	let t0_value = /*stage*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let p_style_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "mx-1");

    			attr_dev(p, "style", p_style_value = `color: ${/*activeStage*/ ctx[0] === /*stage*/ ctx[2]
			? "black"
			: "grey"}`);

    			add_location(p, file$l, 8, 4, 167);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*activeStage*/ 1 && p_style_value !== (p_style_value = `color: ${/*activeStage*/ ctx[0] === /*stage*/ ctx[2]
			? "black"
			: "grey"}`)) {
    				attr_dev(p, "style", p_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(8:2) {#each stages as stage}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div;
    	let each_value = /*stages*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "flex");
    			add_location(div, file$l, 6, 0, 118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeStage, stages*/ 3) {
    				each_value = /*stages*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckoutStage', slots, []);
    	let { activeStage } = $$props;
    	const stages = ["Information", " / ", "Delivery", " / ", "Payment"];
    	const writable_props = ['activeStage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckoutStage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('activeStage' in $$props) $$invalidate(0, activeStage = $$props.activeStage);
    	};

    	$$self.$capture_state = () => ({ activeStage, stages });

    	$$self.$inject_state = $$props => {
    		if ('activeStage' in $$props) $$invalidate(0, activeStage = $$props.activeStage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeStage, stages];
    }

    class CheckoutStage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { activeStage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckoutStage",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*activeStage*/ ctx[0] === undefined && !('activeStage' in props)) {
    			console.warn("<CheckoutStage> was created without expected prop 'activeStage'");
    		}
    	}

    	get activeStage() {
    		throw new Error("<CheckoutStage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeStage(value) {
    		throw new Error("<CheckoutStage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString$2 = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray$1(val) {
      return toString$2.call(val) === '[object Array]';
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
      return toString$2.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject$2(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (toString$2.call(val) !== '[object Object]') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate$1(val) {
      return toString$2.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
      return toString$2.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
      return toString$2.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction$1(val) {
      return toString$2.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject$2(val) && isFunction$1(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim$1(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach$1(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray$1(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray$1(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach$1(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach$1(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    var utils = {
      isArray: isArray$1,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject$2,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate$1,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction$1,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach$1,
      merge: merge,
      extend: extend,
      trim: trim$1,
      stripBOM: stripBOM
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code
        };
      };
      return error;
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;

        if (utils.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(resolve, reject, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError('Request aborted', config, 'ECONNABORTED', request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError('Network Error', config, null, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(
            timeoutErrorMessage,
            config,
            config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken) {
          // Handle cancellation
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (!request) {
              return;
            }

            request.abort();
            reject(cancel);
            // Clean up request
            request = null;
          });
        }

        if (!requestData) {
          requestData = null;
        }

        // Send the request
        request.send(requestData);
      });
    };

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults = {

      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
      },

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }
        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw enhanceError(e, this, 'E_JSON_PARSE');
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      }
    };

    defaults.headers = {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      var context = this || defaults_1;
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      var valueFromConfig2Keys = ['url', 'method', 'data'];
      var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
      var defaultToConfig2Keys = [
        'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
        'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
        'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
        'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
        'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
      ];
      var directMergeKeys = ['validateStatus'];

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      }

      utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        }
      });

      utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

      utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      utils.forEach(directMergeKeys, function merge(prop) {
        if (prop in config2) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      var axiosKeys = valueFromConfig2Keys
        .concat(mergeDeepPropertiesKeys)
        .concat(defaultToConfig2Keys)
        .concat(directMergeKeys);

      var otherKeys = Object
        .keys(config1)
        .concat(Object.keys(config2))
        .filter(function filterAxiosKeys(key) {
          return axiosKeys.indexOf(key) === -1;
        });

      utils.forEach(otherKeys, mergeDeepProperties);

      return config;
    };

    var name = "axios";
    var version = "0.21.4";
    var description = "Promise based HTTP client for the browser and node.js";
    var main = "index.js";
    var scripts = {
    	test: "grunt test",
    	start: "node ./sandbox/server.js",
    	build: "NODE_ENV=production grunt build",
    	preversion: "npm test",
    	version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json",
    	postversion: "git push && git push --tags",
    	examples: "node ./examples/server.js",
    	coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
    	fix: "eslint --fix lib/**/*.js"
    };
    var repository = {
    	type: "git",
    	url: "https://github.com/axios/axios.git"
    };
    var keywords = [
    	"xhr",
    	"http",
    	"ajax",
    	"promise",
    	"node"
    ];
    var author = "Matt Zabriskie";
    var license = "MIT";
    var bugs = {
    	url: "https://github.com/axios/axios/issues"
    };
    var homepage = "https://axios-http.com";
    var devDependencies = {
    	coveralls: "^3.0.0",
    	"es6-promise": "^4.2.4",
    	grunt: "^1.3.0",
    	"grunt-banner": "^0.6.0",
    	"grunt-cli": "^1.2.0",
    	"grunt-contrib-clean": "^1.1.0",
    	"grunt-contrib-watch": "^1.0.0",
    	"grunt-eslint": "^23.0.0",
    	"grunt-karma": "^4.0.0",
    	"grunt-mocha-test": "^0.13.3",
    	"grunt-ts": "^6.0.0-beta.19",
    	"grunt-webpack": "^4.0.2",
    	"istanbul-instrumenter-loader": "^1.0.0",
    	"jasmine-core": "^2.4.1",
    	karma: "^6.3.2",
    	"karma-chrome-launcher": "^3.1.0",
    	"karma-firefox-launcher": "^2.1.0",
    	"karma-jasmine": "^1.1.1",
    	"karma-jasmine-ajax": "^0.1.13",
    	"karma-safari-launcher": "^1.0.0",
    	"karma-sauce-launcher": "^4.3.6",
    	"karma-sinon": "^1.0.5",
    	"karma-sourcemap-loader": "^0.3.8",
    	"karma-webpack": "^4.0.2",
    	"load-grunt-tasks": "^3.5.2",
    	minimist: "^1.2.0",
    	mocha: "^8.2.1",
    	sinon: "^4.5.0",
    	"terser-webpack-plugin": "^4.2.3",
    	typescript: "^4.0.5",
    	"url-search-params": "^0.10.0",
    	webpack: "^4.44.2",
    	"webpack-dev-server": "^3.11.0"
    };
    var browser = {
    	"./lib/adapters/http.js": "./lib/adapters/xhr.js"
    };
    var jsdelivr = "dist/axios.min.js";
    var unpkg = "dist/axios.min.js";
    var typings = "./index.d.ts";
    var dependencies = {
    	"follow-redirects": "^1.14.0"
    };
    var bundlesize = [
    	{
    		path: "./dist/axios.min.js",
    		threshold: "5kB"
    	}
    ];
    var pkg = {
    	name: name,
    	version: version,
    	description: description,
    	main: main,
    	scripts: scripts,
    	repository: repository,
    	keywords: keywords,
    	author: author,
    	license: license,
    	bugs: bugs,
    	homepage: homepage,
    	devDependencies: devDependencies,
    	browser: browser,
    	jsdelivr: jsdelivr,
    	unpkg: unpkg,
    	typings: typings,
    	dependencies: dependencies,
    	bundlesize: bundlesize
    };

    var validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};
    var currentVerArr = pkg.version.split('.');

    /**
     * Compare package versions
     * @param {string} version
     * @param {string?} thanVersion
     * @returns {boolean}
     */
    function isOlderVersion(version, thanVersion) {
      var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
      var destVer = version.split('.');
      for (var i = 0; i < 3; i++) {
        if (pkgVersionArr[i] > destVer[i]) {
          return true;
        } else if (pkgVersionArr[i] < destVer[i]) {
          return false;
        }
      }
      return false;
    }

    /**
     * Transitional option validator
     * @param {function|boolean?} validator
     * @param {string?} version
     * @param {string} message
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      var isDeprecated = version && isOlderVersion(version);

      function formatMessage(opt, desc) {
        return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new Error(formatMessage(opt, ' has been removed in ' + version));
        }

        if (isDeprecated && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new TypeError('option ' + opt + ' must be ' + result);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw Error('Unknown option ' + opt);
        }
      }
    }

    var validator = {
      isOlderVersion: isOlderVersion,
      assertOptions: assertOptions,
      validators: validators$1
    };

    var validators = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
          forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
          clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });

    var Axios_1 = Axios;

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel(message) {
      this.message = message;
    }

    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;

    var Cancel_1 = Cancel;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return (typeof payload === 'object') && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Factory for creating new instances
    axios$1.create = function create(instanceConfig) {
      return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
    };

    // Expose Cancel & CancelToken
    axios$1.Cancel = Cancel_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1$1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var _default$h = axios$1;
    axios_1$1.default = _default$h;

    var axios = axios_1$1;

    var __importDefault$f = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const axios_1 = __importDefault$f(axios);
    class Client {
        constructor(config) {
            this.axiosClient = axios_1.default.create({
                baseURL: config.baseUrl,
            });
        }
        request(method, path, payload) {
            const options = {
                method,
                withCredentials: true,
                url: path,
                data: payload,
                json: true,
            };
            return this.axiosClient(options);
        }
    }
    var _default$g = Client;

    var request = /*#__PURE__*/Object.defineProperty({
    	default: _default$g
    }, '__esModule', {value: true});

    class BaseResource {
        constructor(client) {
            this.client = client;
        }
    }
    var _default$f = BaseResource;

    var base = /*#__PURE__*/Object.defineProperty({
    	default: _default$f
    }, '__esModule', {value: true});

    var __importDefault$e = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$d = __importDefault$e(base);
    class LineItemsResource extends base_1$d.default {
        /**
         * Creates a line-item for a cart
         * @param cart_id id of cart
         * @param payload details needed to create a line-item
         * @returns AsyncResult<{ cart: Cart }>
         */
        create(cart_id, payload) {
            const path = `/store/carts/${cart_id}/line-items`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Updates a line-item.
         * Only quantity updates are allowed
         * @param cart_id id of cart
         * @param line_id id of item to update
         * @param payload details needed to update a line-item
         * @returns AsyncResult<{ cart: Cart }>
         */
        update(cart_id, line_id, payload) {
            const path = `/store/carts/${cart_id}/line-items/${line_id}`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Remove a line-item from a cart
         * @param cart_id id of cart
         * @param line_id id of item to remove
         * @returns AsyncResult<{ cart: Cart }>
         */
        delete(cart_id, line_id) {
            const path = `/store/carts/${cart_id}/line-items/${line_id}`;
            return this.client.request('DELETE', path);
        }
    }
    var _default$e = LineItemsResource;

    var lineItems = /*#__PURE__*/Object.defineProperty({
    	default: _default$e
    }, '__esModule', {value: true});

    var __importDefault$d = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$c = __importDefault$d(base);
    const line_items_1 = __importDefault$d(lineItems);
    class CartsResource extends base_1$c.default {
        constructor() {
            super(...arguments);
            this.lineItems = new line_items_1.default(this.client);
        }
        /**
         * Adds a shipping method to cart
         * @param cart_id Id of cart
         * @param payload Containg id of shipping option and optional data
         * @returns AsyncResult<{ cart: Cart }>
         */
        addShippingMethod(cart_id, payload) {
            const path = `/store/carts/${cart_id}/shipping-methods`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Completes a cart.
         * Payment authorization is attempted and if more work is required, we simply return the cart for further updates.
         * If payment is authorized and order is not yet created, we make sure to do so.
         * The completion of a cart can be performed idempotently with a provided header Idempotency-Key.
         * If not provided, we will generate one for the request.
         * @param cart_id is required
         * @returns AsyncResult<CompleteCartResponse>
         */
        complete(cart_id) {
            const path = `/store/carts/${cart_id}/complete`;
            return this.client.request('POST', path);
        }
        /**
         * Creates a cart
         * @param payload is optional and can contain a region_id and items.
         * The cart will contain the payload, if provided. Otherwise it will be empty
         * @returns AsyncResult<{ cart: Cart }>
         */
        create(payload) {
            const path = `/store/carts`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Creates payment sessions.
         * Initializes the payment sessions that can be used to pay for the items of the cart.
         * This is usually called when a customer proceeds to checkout.
         * @param cart_id is required
         * @returns AsyncResult<{ cart: Cart }>
         */
        createPaymentSessions(cart_id) {
            const path = `/store/carts/${cart_id}/payment-sessions`;
            return this.client.request('POST', path);
        }
        /**
         * Removes a discount from cart.
         * @param cart_id is required
         * @param code discount code to remove
         * @returns AsyncResult<{ cart: Cart }>
         */
        deleteDiscount(cart_id, code) {
            const path = `/store/carts/${cart_id}/discounts/${code}`;
            return this.client.request('DELETE', path);
        }
        /**
         * Removes a payment session from a cart.
         * Can be useful in case a payment has failed
         * @param cart_id is required
         * @param provider_id the provider id of the session e.g. "stripe"
         * @returns AsyncResult<{ cart: Cart }>
         */
        deletePaymentSession(cart_id, provider_id) {
            const path = `/store/carts/${cart_id}/payment-sessions/${provider_id}`;
            return this.client.request('DELETE', path);
        }
        /**
         * Refreshes a payment session.
         * @param cart_id is required
         * @param provider_id the provider id of the session e.g. "stripe"
         * @returns AsyncResult<{ cart: Cart }>
         */
        refreshPaymentSession(cart_id, provider_id) {
            const path = `/store/carts/${cart_id}/payment-sessions/${provider_id}/refresh`;
            return this.client.request('POST', path);
        }
        /**
         * Retrieves a cart
         * @param cart_id is required
         * @returns AsyncResult<{ cart: Cart }>
         */
        retrieve(cart_id) {
            const path = `/store/carts/${cart_id}`;
            return this.client.request('GET', path);
        }
        /**
         * Refreshes a payment session.
         * @param cart_id is required
         * @param payload the provider id of the session e.g. "stripe"
         * @returns AsyncResult<{ cart: Cart }>
         */
        setPaymentSession(cart_id, payload) {
            const path = `/store/carts/${cart_id}/payment-session`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Updates a cart
         * @param cart_id is required
         * @param payload is required and can contain region_id, email, billing and shipping address
         * @returns AsyncResult<{ cart: Cart }>
         */
        update(cart_id, payload) {
            const path = `/store/carts/${cart_id}`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Updates the payment method
         * @param cart_id is required
         * @param provider_id is required
         * @param data is optional and contains TODO:
         * Used to hold any data that the shipping method may need to process the fulfillment of the order.
         * Look at the documentation for your installed fulfillment providers to find out what to send.
         */
        updatePaymentSession(cart_id, payload) {
            const path = `/store/carts/${cart_id}/payment-session/update`;
            return this.client.request('POST', path, payload);
        }
    }
    var _default$d = CartsResource;

    var carts = /*#__PURE__*/Object.defineProperty({
    	default: _default$d
    }, '__esModule', {value: true});

    var __importDefault$c = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$b = __importDefault$c(base);
    class AddressesResource extends base_1$b.default {
        /**
         * Adds an address to a customers saved addresses
         * @param id id of customer
         * @param payload contains information to create an address
         * @returns AsyncResult<{ customer: Customer }>
         */
        addAddress(id, payload) {
            const path = `/store/customers/${id}/addresses`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Deletes an address of a customer
         * @param id id of customer
         * @param address_id id of the address to delete
         * @returns AsyncResult<{ customer: Customer }>
         */
        deleteAddress(id, address_id) {
            const path = `/store/customers/${id}/addresses/${address_id}`;
            return this.client.request('DELETE', path);
        }
        /**
         * Update an address of a customer
         * @param id id of customer
         * @returns AsyncResult<{ customer: Customer }>
         */
        updateAddress(id, address_id, payload) {
            const path = `/store/customers/${id}/addresses/${address_id}`;
            return this.client.request('POST', path, payload);
        }
    }
    var _default$c = AddressesResource;

    var addresses = /*#__PURE__*/Object.defineProperty({
    	default: _default$c
    }, '__esModule', {value: true});

    var __importDefault$b = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$a = __importDefault$b(base);
    class PaymentMethodsResource extends base_1$a.default {
        /**
         * Lists customer payment methods
         * @param id id of cart
         * @returns AsyncResult<{ payment_methods: object[] }>
         */
        list(id) {
            const path = `/store/carts/${id}/payment-methods`;
            return this.client.request('GET', path);
        }
    }
    var _default$b = PaymentMethodsResource;

    var paymentMethods = /*#__PURE__*/Object.defineProperty({
    	default: _default$b
    }, '__esModule', {value: true});

    var __importDefault$a = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const addresses_1 = __importDefault$a(addresses);
    const base_1$9 = __importDefault$a(base);
    const payment_methods_1 = __importDefault$a(paymentMethods);
    class CustomerResource extends base_1$9.default {
        constructor() {
            super(...arguments);
            this.paymentMethods = new payment_methods_1.default(this.client);
            this.addresses = new addresses_1.default(this.client);
        }
        /**
         * Creates a customer
         * @param payload information of customer
         * @returns AsyncResult<{ customer: Customer }>
         */
        create(payload) {
            const path = `/store/customers`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Retrieves a customer
         * @param id id of customer
         * @returns AsyncResult<{ customer: Customer }>
         */
        retrieve(id) {
            const path = `/store/customers/${id}`;
            return this.client.request('GET', path);
        }
        /**
         * Updates a customer
         * @param id id of customer
         * @param payload information to update customer with
         * @returns AsyncResult<{ customer: Customer }>
         */
        update(id, payload) {
            const path = `/store/customers/${id}`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Retrieve customer orders
         * @param id id of customer
         * @returns AsyncResult<object[]>
         */
        listOrders(id) {
            const path = `/store/customers/${id}/orders`;
            return this.client.request('GET', path);
        }
        /**
         * Resets customer password
         * @param payload info used to reset customer password
         * @returns AsyncResult<{ customer: Customer }>
         */
        resetPassword(payload) {
            const path = `/store/customers/password-reset`;
            return this.client.request('POST', path, payload);
        }
        /**
         * Generates a reset password token
         * @param payload info used to generate token
         * @returns AsyncResult<{ customer: Customer }>
         */
        generatePasswordToken(payload) {
            const path = `/store/customers/password-token`;
            return this.client.request('POST', path, payload);
        }
    }
    var _default$a = CustomerResource;

    var customers = /*#__PURE__*/Object.defineProperty({
    	default: _default$a
    }, '__esModule', {value: true});

    var __importDefault$9 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$8 = __importDefault$9(base);
    class OrdersResource extends base_1$8.default {
        /**
         * @description Retrieves an order
         * @param id is required
         * @returns AsyncResult<{ order: Order }>
         */
        retrieve(id) {
            const path = `/store/orders/${id}`;
            return this.client.request('GET', path);
        }
        /**
         * @description Retrieves an order by cart id
         * @param cart_id is required
         * @returns AsyncResult<{ order: Order }>
         */
        retrieveByCartId(cart_id) {
            const path = `/store/orders/cart/${cart_id}`;
            return this.client.request('GET', path);
        }
        /**
         * @description Look up an order using order details
         * @param payload details used to look up the order
         * @returns AsyncResult<{ order: Order }>
         */
        lookupOrder(payload) {
            let path = `/store/orders?`;
            const queryString = Object.entries(payload).map(([key, value]) => {
                let val = value;
                if (Array.isArray(value)) {
                    val = value.join(',');
                }
                return `${key}=${encodeURIComponent(val)}`;
            });
            path = `/store/orders?${queryString.join('&')}`;
            return this.client.request('GET', path, payload);
        }
    }
    var _default$9 = OrdersResource;

    var orders = /*#__PURE__*/Object.defineProperty({
    	default: _default$9
    }, '__esModule', {value: true});

    var __importDefault$8 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$7 = __importDefault$8(base);
    class ProductVariantsResource extends base_1$7.default {
        /**
         * @description Retrieves a single product variant
         * @param id is required
         * @returns AsyncResult<{ variant: ProductVariant }>
         */
        retrieve(id) {
            const path = `/store/variants/${id}`;
            return this.client.request('GET', path);
        }
        /**
         * @description Retrieves a list of of Product Variants
         * @param params ids is optional and used to return a specific list of Product Variants
         * @returns AsyncResult<{ variants: ProductVariant[] }>
         */
        list(ids) {
            const path = `/store/variants`;
            const search = Object.entries(ids).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}=${value.join(',')}`;
                }
                return `${key}=${value}`;
            });
            return this.client.request('GET', `${path}${search.length > 0 && `?${search.join('&')}`}`);
        }
    }
    var _default$8 = ProductVariantsResource;

    var productVariants = /*#__PURE__*/Object.defineProperty({
    	default: _default$8
    }, '__esModule', {value: true});

    var __importDefault$7 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$6 = __importDefault$7(base);
    const product_variants_1 = __importDefault$7(productVariants);
    class ProductsResource extends base_1$6.default {
        constructor() {
            super(...arguments);
            this.variants = new product_variants_1.default(this.client);
        }
        /**
         * @description Retrieves a single Product
         * @param id is required
         * @returns AsyncResult<{ product: Product }>
         */
        retrieve(id) {
            const path = `/store/products/${id}`;
            return this.client.request('GET', path);
        }
        /**
         * @description Retrieves a list of products
         * @param query is optional. Can contain a limit and offset for the returned list
         * @returns AsyncResult<{ products: Product[] }>
         */
        list(query) {
            let path = `/store/products`;
            if (query) {
                const queryString = Object.entries(query).map(([key, value]) => {
                    return `${key}=${value}`;
                });
                path = `/store/products?${queryString.join('&')}`;
            }
            return this.client.request('GET', path);
        }
    }
    var _default$7 = ProductsResource;

    var products$1 = /*#__PURE__*/Object.defineProperty({
    	default: _default$7
    }, '__esModule', {value: true});

    var __importDefault$6 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$5 = __importDefault$6(base);
    class RegionsResource extends base_1$5.default {
        /**
         * @description Retrieves a list of regions
         * @returns AsyncResult<{ regions: Region[] }>
         */
        list() {
            const path = `/store/regions`;
            return this.client.request('GET', path);
        }
        /**
         * @description Retrieves a region
         * @param id is required
         * @returns AsyncResult<{ region: Region }>
         */
        retrieve(id) {
            const path = `/store/regions/${id}`;
            return this.client.request('GET', path);
        }
    }
    var _default$6 = RegionsResource;

    var regions = /*#__PURE__*/Object.defineProperty({
    	default: _default$6
    }, '__esModule', {value: true});

    var __importDefault$5 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$4 = __importDefault$5(base);
    class ShippingOptionsResource extends base_1$4.default {
        /**
         * @description Lists shiping options available for a cart
         * @param query should contain cart id
         * @returns AsyncResult<{ shipping_options: ShippingOptions[] }>
         */
        listCartOptions(cart_id) {
            let path = `/store/shipping-options/${cart_id}`;
            return this.client.request('GET', path);
        }
        /**
         * @description Lists shiping options available for a cart
         * @param query should contain cart id
         * @returns AsyncResult<{ shipping_options: ShippingOptions[] }>
         */
        list(query) {
            let path = `/store/shipping-options`;
            if (typeof query === 'string') {
                path = `/store/shipping-options/${query}`;
            }
            else {
                const queryString = Object.entries(query).map(([key, value]) => {
                    let val = value;
                    if (Array.isArray(value)) {
                        val = value.join(',');
                    }
                    return `${key}=${val}`;
                });
                path = `/store/shipping-options?${queryString.join('&')}`;
            }
            return this.client.request('GET', path);
        }
    }
    var _default$5 = ShippingOptionsResource;

    var shippingOptions = /*#__PURE__*/Object.defineProperty({
    	default: _default$5
    }, '__esModule', {value: true});

    var __importDefault$4 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$3 = __importDefault$4(base);
    class SwapsResource extends base_1$3.default {
        /**
         * @description Creates a swap from a cart
         * @param payload contains the id of the cart
         * @returns AsyncResult<{ swap: Swap }>
         */
        create(payload) {
            const path = `/store/swaps`;
            return this.client.request('POST', path, payload);
        }
        /**
         * @description Retrieves a swap by cart id
         * @param cart_id id of cart
         * @returns AsyncResult<{ swap: Swap }>
         */
        retrieveByCartId(cart_id) {
            const path = `/store/swaps/${cart_id}`;
            return this.client.request('GET', path);
        }
    }
    var _default$4 = SwapsResource;

    var swaps = /*#__PURE__*/Object.defineProperty({
    	default: _default$4
    }, '__esModule', {value: true});

    var error = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MedusaConnectionError = exports.MedusaPermissionError = exports.MedusaAuthenticationError = exports.MedusaAPIError = exports.MedusaInvalidRequestError = void 0;
    /**
     * MedusaError is the base error for every other MedusaError
     */
    class MedusaError extends Error {
        constructor() {
            super();
        }
        static factory(type) {
            switch (type) {
                case ErrorType.INVALID_REQUEST:
                    return new MedusaInvalidRequestError();
                case ErrorType.AUTHENTICATION:
                    return new MedusaAuthenticationError();
                case ErrorType.API:
                    return new MedusaAPIError();
                case ErrorType.PERMISSION:
                    return new MedusaPermissionError();
                case ErrorType.CONNECTION:
                    return new MedusaConnectionError();
            }
        }
    }
    exports.default = MedusaError;
    var ErrorType;
    (function (ErrorType) {
        ErrorType[ErrorType["INVALID_REQUEST"] = 0] = "INVALID_REQUEST";
        ErrorType[ErrorType["API"] = 1] = "API";
        ErrorType[ErrorType["AUTHENTICATION"] = 2] = "AUTHENTICATION";
        ErrorType[ErrorType["PERMISSION"] = 3] = "PERMISSION";
        ErrorType[ErrorType["CONNECTION"] = 4] = "CONNECTION";
    })(ErrorType || (ErrorType = {}));
    /**
     * MedusaInvalidRequestError is raised when a request as invalid parameters.
     */
    class MedusaInvalidRequestError extends MedusaError {
    }
    exports.MedusaInvalidRequestError = MedusaInvalidRequestError;
    /**
     * MedusaAPIError is raised in case no other type cover the problem
     */
    class MedusaAPIError extends MedusaError {
    }
    exports.MedusaAPIError = MedusaAPIError;
    /**
     * MedusaAuthenticationError is raised when invalid credentials is used to connect to Medusa
     */
    class MedusaAuthenticationError extends MedusaError {
    }
    exports.MedusaAuthenticationError = MedusaAuthenticationError;
    /**
     * MedusaPermissionErorr is raised when attempting to access a resource without permissions
     */
    class MedusaPermissionError extends MedusaError {
    }
    exports.MedusaPermissionError = MedusaPermissionError;
    /**
     * MedusaConnectionError is raised when the Medusa servers can't be reached.
     */
    class MedusaConnectionError extends MedusaError {
    }
    exports.MedusaConnectionError = MedusaConnectionError;
    });

    var __importDefault$3 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$2 = __importDefault$3(base);
    class AuthResource extends base_1$2.default {
        /**
         * @description Authenticates a customer using email and password combination
         * @returns AsyncResult<{ customer: Customer }>
         */
        authenticate(payload) {
            const path = `/store/auth`;
            return this.client.request('POST', path, payload);
        }
        /**
         * @description Retrieves an authenticated session
         * Usually used to check if authenticated session is alive.
         * @returns AsyncResult<{ customer: Customer }>
         */
        getSession() {
            const path = `/store/auth`;
            return this.client.request('GET', path);
        }
        /**
         * @description Check if email exists
         * @param email is required
         * @returns AsyncResult<{ exists: boolean }>
         */
        exists(email) {
            const path = `/store/auth/${email}`;
            return this.client.request('GET', path);
        }
    }
    var _default$3 = AuthResource;

    var auth = /*#__PURE__*/Object.defineProperty({
    	default: _default$3
    }, '__esModule', {value: true});

    var __importDefault$2 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1$1 = __importDefault$2(base);
    class ReturnReasonsResource extends base_1$1.default {
        /**
         * @description Retrieves a single Return Reason
         * @param id is required
         * @returns AsyncResult<{ return_reason: ReturnReason }>
         */
        retrieve(id) {
            const path = `/store/return-reasons/${id}`;
            return this.client.request('GET', path);
        }
        /**
         * Lists return reasons defined in Medusa Admin
         * @returns AsyncResult<{ return_reasons: ReturnReason[] }>
         */
        list() {
            const path = `/store/return-reasons`;
            return this.client.request('GET', path);
        }
    }
    var _default$2 = ReturnReasonsResource;

    var returnReasons = /*#__PURE__*/Object.defineProperty({
    	default: _default$2
    }, '__esModule', {value: true});

    var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const base_1 = __importDefault$1(base);
    class ReturnsResource extends base_1.default {
        /**
         * Creates a return request
         * @param payload details needed to create a return
         * @returns AsyncResult<{ return: Return }>
         */
        create(payload) {
            const path = `/store/returns`;
            return this.client.request('GET', path);
        }
    }
    var _default$1 = ReturnsResource;

    var returns = /*#__PURE__*/Object.defineProperty({
    	default: _default$1
    }, '__esModule', {value: true});

    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    const request_1 = __importDefault(request);
    const carts_1 = __importDefault(carts);
    const customers_1 = __importDefault(customers);
    const orders_1 = __importDefault(orders);
    const products_1 = __importDefault(products$1);
    const regions_1 = __importDefault(regions);
    const shipping_options_1 = __importDefault(shippingOptions);
    const swaps_1 = __importDefault(swaps);
    const error_1 = __importDefault(error);
    const auth_1 = __importDefault(auth);
    const return_reasons_1 = __importDefault(returnReasons);
    const returns_1 = __importDefault(returns);
    class Medusa {
        constructor(config) {
            this.client = new request_1.default(config);
            this.auth = new auth_1.default(this.client);
            this.carts = new carts_1.default(this.client);
            this.customers = new customers_1.default(this.client);
            this.errors = new error_1.default();
            this.orders = new orders_1.default(this.client);
            this.products = new products_1.default(this.client);
            this.regions = new regions_1.default(this.client);
            this.returnReasons = new return_reasons_1.default(this.client);
            this.returns = new returns_1.default(this.client);
            this.shippingOptions = new shipping_options_1.default(this.client);
            this.swaps = new swaps_1.default(this.client);
        }
    }
    var _default = Medusa;

    var creds = {
        medusa_backend_url: "http://localhost:9000"
    };

    const BACKEND_URL = creds?.medusa_backend_url || "http://localhost:9000";

    const createClient = () => new _default({ baseUrl: BACKEND_URL });

    const checkoutStore = writable({
        currentCheckoutStep : "Information",
        hasSelectedShipping : false
    });

    const updateCheckoutStore = ({ currentStep , hasSelectedShipping }) => {
        checkoutStore.update((state) => {
            state.currentCheckoutStep = currentStep || state.currentCheckoutStep;
            state.hasSelectedShipping = hasSelectedShipping || state.hasSelectedShipping;

            return state
        });
    };

    const medusaClient$1 = createClient();

    const medusaCartState = writable({
        cart_id: localStorage.getItem("MEDUSA_CART"),
        cart: {}
    });

    const medusaCartConfirmation = writable([]);

    const createMedusaCart = async () => {
        try {
            const {data} = await medusaClient$1.carts.create();

            return data.cart
        } catch (e) {
            console.log(`Error creating cart: ${e}`);
        }
    };

    const saveMedusaCartId = async () => {
        try {
            const newCart = await createMedusaCart();

            const stringCartObj = JSON.stringify({cart_id: newCart.id});
            localStorage.setItem('MEDUSA_CART', stringCartObj);

            medusaCartState.update(state => {
                state.cart_id = stringCartObj;

                return state
            });
        } catch (e) {
            console.log(`Error saving cart ID: ${e}`);
        }
    };

    const retrieveCartId = () => {
        let cartId;

        medusaCartState.subscribe(state => {
            const {cart_id} = JSON.parse(state.cart_id);

            cartId = cart_id;
        });

        return cartId
    };

    const handleStoreCart = async () => {
        let savedCartId;
        savedCartId = localStorage.getItem("MEDUSA_CART");

        if (!savedCartId) {
            console.log("-> Creating cart ");

            await saveMedusaCartId();
        } else {
            const {cart_id} = JSON.parse(savedCartId);
            const {data} = await medusaClient$1.carts.retrieve(cart_id);

            medusaCartState.update(state => {
                state.cart = data.cart;
                return state
            });
        }
    };

    const addCartInfo = async (userDetailsObj, email) => {
        try {
            const cartId = retrieveCartId();

            const {data} = await medusaClient$1.carts.update(cartId, {
                shipping_address: userDetailsObj,
                billing_address: userDetailsObj,
                email: email
            });

            medusaCartState.update(state => {
                state.cart = data.cart;

                return state
            });

            updateCheckoutStore({
                currentStep: "Delivery"
            });
        } catch (e) {
            console.log(`Error adding cart info: ${e}`);
        }
    };

    const addVariantToCart = async (variantId, quantity) => {
        try {
            const cartId = retrieveCartId();

            await medusaClient$1.carts.lineItems.create(cartId, {
                variant_id: variantId,
                quantity: quantity
            });

            // refresh cart
            await handleStoreCart();
        } catch (e) {
            console.log(`Error adding cart variant: ${e}`);
        }
    };

    const deleteVariantFromCart = async (lineId) => {
        try {
            const cartId = retrieveCartId();

            const {data} = await medusaClient$1.carts.lineItems.delete(cartId, lineId);

            medusaCartState.update(state => {
                state.cart = data.cart;

                return state
            });
        } catch (e) {
            console.log(`Error deleting cart variant: ${e}`);
        }
    };

    const completeCartCheckout = async () => {
        try {
            const cartId = retrieveCartId();

            const {data} = await medusaClient$1.carts.complete(cartId);

            medusaCartConfirmation.update((state) => {
                // response contains a nested data.data object
                state = data.data;

                return state
            });
            localStorage.clear();
            medusaCartState.update((state) =>  {
                state.cart =  { items : [] };

                return state
            });

            await handleStoreCart();
        } catch (e) {
            console.log(`Error starting payment session: ${e}`);
        }
    };

    const resetCart = async () => {
        // Cart has been checked-out. Reset all stored state.
        console.log("-> Resetting saved Medusa Cart ID");

        localStorage.clear();
        medusaCartState.update((state) =>  {
            state.cart =  { items : [] };

            return state
        });

        await handleStoreCart();
        navigate("/");
        location.reload();
    };

    const products = writable({
        cartItems: []
    });

    // CHECKOUT COMPONENT STATE =================>
    const checkoutState = writable(false);

    const setCheckoutState = newState => {
        checkoutState.update((oldState) => {
            oldState = newState;
            return oldState
        });
    };

    const formatPrice = (price, currency) => {
        return `${(price / 100).toFixed(2)} ${currency && currency.toUpperCase()}`;
    };

    const quantity = (item) => {
        return item.quantity;
    };

    const sum = (prev, next) => {
        return prev + next;
    };

    const getRouteParam = (url, itemKey) => {
        const param = url.split("/");

        return param[itemKey]
    };

    function getTaxRate(cart) {
        if ("tax_rate" in cart) {
            return cart.tax_rate / 100;
        } else if (cart.region) {
            return cart.region && cart.region.tax_rate / 100;
        }
        return 0;
    }

    function formatMoneyAmount(moneyAmount, digits, taxRate = 0) {
        let locale = "en-US";

        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: moneyAmount.currencyCode,
            minimumFractionDigits: digits,
        }).format(moneyAmount.amount * (1 + taxRate / 100));
    }

    function getVariantPrice(cart, variant) {
        let taxRate = getTaxRate(cart);

        let moneyAmount = variant.prices.find(
            (p) =>
             p.currency_code.toLowerCase() === cart.region.currency_code.toLowerCase()
        );

        if (moneyAmount && moneyAmount.amount) {
            return (moneyAmount.amount * (1 + taxRate)) / 100;
        }

        return undefined;
    }

    function formatPrices(cart, variant, digits = 2) {
        if (!cart || !variant) return;
        if (!variant.prices) return `15.00 EUR`;
        if (!cart.region) return `15.00 EUR`;

        return formatMoneyAmount(
            {
                currencyCode: cart.region.currency_code,
                amount: getVariantPrice(cart, variant),
            },
            digits
        );
    }

    /* src/components/cart-view.svelte generated by Svelte v3.44.1 */
    const file$k = "src/components/cart-view.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i].id;
    	child_ctx[7] = list[i].thumbnail;
    	child_ctx[8] = list[i].variant;
    	child_ctx[9] = list[i].unit_price;
    	child_ctx[10] = list[i].quantity;
    	child_ctx[11] = list[i].title;
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (36:2) {:else}
    function create_else_block$a(ctx) {
    	let ul0;
    	let li0;
    	let p0;
    	let t1;
    	let li1;
    	let p1;

    	let t2_value = (/*userCart*/ ctx[1].items.length > 0
    	? /*userCart*/ ctx[1]?.items.map(quantity).reduce(sum)
    	: 0) + "";

    	let t2;
    	let t3_value = " " + "";
    	let t3;
    	let t4;

    	let t5_value = (/*userCart*/ ctx[1]?.items.length > 0 && /*userCart*/ ctx[1]?.items.map(quantity).reduce(sum) === 1
    	? "item"
    	: "items") + "";

    	let t5;
    	let t6;
    	let li2;
    	let div;
    	let svg;
    	let path;
    	let t7;
    	let ul1;
    	let t8;
    	let ul2;
    	let li3;
    	let p2;
    	let t10;
    	let p3;
    	let t11_value = formatPrice(/*userCart*/ ctx[1].subtotal, /*userCart*/ ctx[1].region?.currency_code) + "";
    	let t11;
    	let t12;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*userCart*/ ctx[1].items.length < 1) return create_if_block_2$3;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*userCart*/ ctx[1].items.length > 0 && create_if_block_1$5(ctx);

    	const block = {
    		c: function create() {
    			ul0 = element("ul");
    			li0 = element("li");
    			p0 = element("p");
    			p0.textContent = "Bag";
    			t1 = space();
    			li1 = element("li");
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			li2 = element("li");
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t7 = space();
    			ul1 = element("ul");
    			if_block0.c();
    			t8 = space();
    			ul2 = element("ul");
    			li3 = element("li");
    			p2 = element("p");
    			p2.textContent = "Subtotal (incl. taxes)";
    			t10 = space();
    			p3 = element("p");
    			t11 = text(t11_value);
    			t12 = space();
    			if (if_block1) if_block1.c();
    			add_location(p0, file$k, 38, 8, 886);
    			add_location(li0, file$k, 37, 6, 873);
    			add_location(p1, file$k, 42, 8, 929);
    			add_location(li1, file$k, 41, 6, 916);
    			attr_dev(path, "d", "M6 18L18 6M6 6l12 12");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			add_location(path, file$k, 62, 12, 1501);
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$k, 55, 10, 1307);
    			attr_dev(div, "class", "hover");
    			add_location(div, file$k, 54, 8, 1236);
    			add_location(li2, file$k, 53, 6, 1223);
    			attr_dev(ul0, "class", "flex justify-between");
    			add_location(ul0, file$k, 36, 4, 833);
    			attr_dev(ul1, "class", "list");
    			add_location(ul1, file$k, 73, 4, 1726);
    			add_location(p2, file$k, 127, 8, 3297);
    			add_location(p3, file$k, 128, 8, 3335);
    			attr_dev(li3, "class", "flex justify-between");
    			add_location(li3, file$k, 126, 6, 3255);
    			add_location(ul2, file$k, 125, 4, 3244);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul0, anchor);
    			append_dev(ul0, li0);
    			append_dev(li0, p0);
    			append_dev(ul0, t1);
    			append_dev(ul0, li1);
    			append_dev(li1, p1);
    			append_dev(p1, t2);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			append_dev(p1, t5);
    			append_dev(ul0, t6);
    			append_dev(ul0, li2);
    			append_dev(li2, div);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, ul1, anchor);
    			if_block0.m(ul1, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, ul2, anchor);
    			append_dev(ul2, li3);
    			append_dev(li3, p2);
    			append_dev(li3, t10);
    			append_dev(li3, p3);
    			append_dev(p3, t11);
    			append_dev(ul2, t12);
    			if (if_block1) if_block1.m(ul2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*userCart*/ 2) && t2_value !== (t2_value = (/*userCart*/ ctx[1].items.length > 0
    			? /*userCart*/ ctx[1]?.items.map(quantity).reduce(sum)
    			: 0) + "")) set_data_dev(t2, t2_value);

    			if ((!current || dirty & /*userCart*/ 2) && t5_value !== (t5_value = (/*userCart*/ ctx[1]?.items.length > 0 && /*userCart*/ ctx[1]?.items.map(quantity).reduce(sum) === 1
    			? "item"
    			: "items") + "")) set_data_dev(t5, t5_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(ul1, null);
    				}
    			}

    			if ((!current || dirty & /*userCart*/ 2) && t11_value !== (t11_value = formatPrice(/*userCart*/ ctx[1].subtotal, /*userCart*/ ctx[1].region?.currency_code) + "")) set_data_dev(t11, t11_value);

    			if (/*userCart*/ ctx[1].items.length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*userCart*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(ul2, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(ul1);
    			if_block0.d();
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(ul2);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(36:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:2) {#if isLoading}
    function create_if_block$b(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Loading ...";
    			add_location(p, file$k, 33, 6, 789);
    			add_location(div, file$k, 32, 4, 777);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(32:2) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    // (83:6) {:else}
    function create_else_block_1$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*userCart*/ ctx[1].items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*deleteVariantFromCart, userCart, formatPrice*/ 2) {
    				each_value = /*userCart*/ ctx[1].items;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(83:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (75:6) {#if userCart.items.length < 1}
    function create_if_block_2$3(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "Cart Empty";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Your cart is currently empty";
    			attr_dev(p0, "class", "center");
    			add_location(p0, file$k, 76, 10, 1806);
    			attr_dev(p1, "class", "sub-text");
    			set_style(p1, "text-align", "center");
    			add_location(p1, file$k, 78, 10, 1850);
    			add_location(div, file$k, 75, 8, 1790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(75:6) {#if userCart.items.length < 1}",
    		ctx
    	});

    	return block;
    }

    // (84:8) {#each userCart.items as { id, thumbnail, variant, unit_price, quantity, title }
    function create_each_block$7(ctx) {
    	let li5;
    	let div1;
    	let div0;
    	let img;
    	let img_alt_value;
    	let img_src_value;
    	let t0;
    	let ul;
    	let li0;
    	let p0;
    	let t1_value = /*title*/ ctx[11] + "";
    	let t1;
    	let t2;
    	let li1;
    	let p1;
    	let t3;
    	let t4_value = /*variant*/ ctx[8].title + "";
    	let t4;
    	let t5;
    	let li2;
    	let p2;
    	let t6;
    	let t7_value = formatPrice(/*unit_price*/ ctx[9], /*userCart*/ ctx[1].region.currency_code) + "";
    	let t7;
    	let t8;
    	let li3;
    	let p3;
    	let t9;
    	let t10_value = /*quantity*/ ctx[10] + "";
    	let t10;
    	let t11;
    	let li4;
    	let p4;
    	let t13;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[4](/*id*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			li5 = element("li");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			p0 = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			li1 = element("li");
    			p1 = element("p");
    			t3 = text("Size: ");
    			t4 = text(t4_value);
    			t5 = space();
    			li2 = element("li");
    			p2 = element("p");
    			t6 = text("Price: ");
    			t7 = text(t7_value);
    			t8 = space();
    			li3 = element("li");
    			p3 = element("p");
    			t9 = text("Quantity: ");
    			t10 = text(t10_value);
    			t11 = space();
    			li4 = element("li");
    			p4 = element("p");
    			p4.textContent = "Remove";
    			t13 = space();
    			attr_dev(img, "class", "cart-image");
    			attr_dev(img, "alt", img_alt_value = `Cart ${/*title*/ ctx[11]}`);
    			if (!src_url_equal(img.src, img_src_value = /*thumbnail*/ ctx[7])) attr_dev(img, "src", img_src_value);
    			add_location(img, file$k, 87, 16, 2191);
    			add_location(p0, file$k, 91, 20, 2334);
    			add_location(li0, file$k, 90, 18, 2309);
    			attr_dev(p1, "class", "sub-text");
    			add_location(p1, file$k, 94, 20, 2416);
    			add_location(li1, file$k, 93, 18, 2391);
    			attr_dev(p2, "class", "sub-text");
    			add_location(p2, file$k, 97, 20, 2529);
    			add_location(li2, file$k, 96, 18, 2504);
    			attr_dev(p3, "class", "sub-text");
    			add_location(p3, file$k, 106, 20, 2801);
    			add_location(li3, file$k, 105, 18, 2776);
    			attr_dev(p4, "class", "remove-btn");
    			add_location(p4, file$k, 110, 20, 2914);
    			add_location(li4, file$k, 109, 18, 2889);
    			attr_dev(ul, "class", "ml-7");
    			add_location(ul, file$k, 89, 16, 2273);
    			set_style(div0, "display", "flex");
    			add_location(div0, file$k, 86, 14, 2147);
    			attr_dev(div1, "class", "product-ctn");
    			add_location(div1, file$k, 85, 12, 2107);
    			add_location(li5, file$k, 84, 10, 2090);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li5, anchor);
    			append_dev(li5, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, p0);
    			append_dev(p0, t1);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, p1);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, p2);
    			append_dev(p2, t6);
    			append_dev(p2, t7);
    			append_dev(ul, t8);
    			append_dev(ul, li3);
    			append_dev(li3, p3);
    			append_dev(p3, t9);
    			append_dev(p3, t10);
    			append_dev(ul, t11);
    			append_dev(ul, li4);
    			append_dev(li4, p4);
    			append_dev(li5, t13);

    			if (!mounted) {
    				dispose = listen_dev(p4, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*userCart*/ 2 && img_alt_value !== (img_alt_value = `Cart ${/*title*/ ctx[11]}`)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*userCart*/ 2 && !src_url_equal(img.src, img_src_value = /*thumbnail*/ ctx[7])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*userCart*/ 2 && t1_value !== (t1_value = /*title*/ ctx[11] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*userCart*/ 2 && t4_value !== (t4_value = /*variant*/ ctx[8].title + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*userCart*/ 2 && t7_value !== (t7_value = formatPrice(/*unit_price*/ ctx[9], /*userCart*/ ctx[1].region.currency_code) + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*userCart*/ 2 && t10_value !== (t10_value = /*quantity*/ ctx[10] + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(84:8) {#each userCart.items as { id, thumbnail, variant, unit_price, quantity, title }",
    		ctx
    	});

    	return block;
    }

    // (132:6) {#if userCart.items.length > 0}
    function create_if_block_1$5(ctx) {
    	let li;
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/checkout",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link.$on("click", /*click_handler_2*/ ctx[5]);

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(link.$$.fragment);
    			add_location(li, file$k, 132, 8, 3466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(132:6) {#if userCart.items.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (134:10) <Link to="/checkout" on:click={() => setCheckoutState(false)}>
    function create_default_slot$9(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Checkout";
    			attr_dev(button, "class", "custom-btn");
    			add_location(button, file$k, 134, 12, 3556);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(134:10) <Link to=\\\"/checkout\\\" on:click={() => setCheckoutState(false)}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let nav;
    	let current_block_type_index;
    	let if_block;
    	let nav_style_value;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLoading*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if_block.c();
    			attr_dev(nav, "class", "menu-nav");

    			attr_dev(nav, "style", nav_style_value = `transform: ${/*checkoutVisibility*/ ctx[2]
			? "translateX(-460px)"
			: "translateX(110%)"}`);

    			add_location(nav, file$k, 25, 0, 632);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			if_blocks[current_block_type_index].m(nav, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(nav, null);
    			}

    			if (!current || dirty & /*checkoutVisibility*/ 4 && nav_style_value !== (nav_style_value = `transform: ${/*checkoutVisibility*/ ctx[2]
			? "translateX(-460px)"
			: "translateX(110%)"}`)) {
    				attr_dev(nav, "style", nav_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cart_view', slots, []);
    	let isLoading = true;
    	let userCart = [];
    	let checkoutVisibility;

    	checkoutState.subscribe(state => {
    		$$invalidate(2, checkoutVisibility = state);
    	});

    	medusaCartState.subscribe(state => {
    		if (state.cart.items) {
    			$$invalidate(1, userCart = state.cart);
    			$$invalidate(0, isLoading = false);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cart_view> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setCheckoutState(false);
    	const click_handler_1 = id => deleteVariantFromCart(id);
    	const click_handler_2 = () => setCheckoutState(false);

    	$$self.$capture_state = () => ({
    		Link,
    		deleteVariantFromCart,
    		medusaCartState,
    		checkoutState,
    		setCheckoutState,
    		formatPrice,
    		quantity,
    		sum,
    		isLoading,
    		userCart,
    		checkoutVisibility
    	});

    	$$self.$inject_state = $$props => {
    		if ('isLoading' in $$props) $$invalidate(0, isLoading = $$props.isLoading);
    		if ('userCart' in $$props) $$invalidate(1, userCart = $$props.userCart);
    		if ('checkoutVisibility' in $$props) $$invalidate(2, checkoutVisibility = $$props.checkoutVisibility);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isLoading,
    		userCart,
    		checkoutVisibility,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Cart_view extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cart_view",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src/components/Nav.svelte generated by Svelte v3.44.1 */
    const file$j = "src/components/Nav.svelte";

    // (39:6) {:else}
    function create_else_block$9(ctx) {
    	let li2;
    	let ul;
    	let li0;
    	let p;
    	let t1;
    	let li1;
    	let svg;
    	let path;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*isLoading*/ ctx[2] && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			li2 = element("li");
    			ul = element("ul");
    			li0 = element("li");
    			p = element("p");
    			p.textContent = "Cart";
    			t1 = space();
    			li1 = element("li");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t2 = space();
    			if (if_block) if_block.c();
    			add_location(p, file$j, 46, 14, 1164);
    			attr_dev(li0, "class", "header-item svelte-1fhpg");
    			add_location(li0, file$j, 45, 12, 1125);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z");
    			add_location(path, file$j, 57, 16, 1468);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$j, 50, 14, 1246);
    			attr_dev(li1, "class", "header-item svelte-1fhpg");
    			add_location(li1, file$j, 49, 12, 1207);
    			attr_dev(ul, "class", "flex svelte-1fhpg");
    			add_location(ul, file$j, 44, 10, 1095);
    			set_style(li2, "text-align", "right");
    			attr_dev(li2, "class", "cursor-pointer pt-3 svelte-1fhpg");
    			add_location(li2, file$j, 39, 8, 947);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li2, anchor);
    			append_dev(li2, ul);
    			append_dev(ul, li0);
    			append_dev(li0, p);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, svg);
    			append_dev(svg, path);
    			append_dev(ul, t2);
    			if (if_block) if_block.m(ul, null);

    			if (!mounted) {
    				dispose = listen_dev(li2, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*isLoading*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li2);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(39:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:6) {#if hideCartControls}
    function create_if_block$a(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = ".";
    			set_style(p, "opacity", "0");
    			add_location(p, file$j, 37, 8, 897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(37:6) {#if hideCartControls}",
    		ctx
    	});

    	return block;
    }

    // (67:12) {#if isLoading}
    function create_if_block_1$4(ctx) {
    	let li;

    	let t_value = (/*userCart*/ ctx[1].items.length > 0
    	? /*userCart*/ ctx[1]?.items.map(quantity).reduce(sum)
    	: 0) + "";

    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "header-item svelte-1fhpg");
    			add_location(li, file$j, 67, 14, 1758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*userCart*/ 2 && t_value !== (t_value = (/*userCart*/ ctx[1].items.length > 0
    			? /*userCart*/ ctx[1]?.items.map(quantity).reduce(sum)
    			: 0) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(67:12) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let nav;
    	let div;
    	let ul;
    	let li;
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let cartview;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*hideCartControls*/ ctx[0]) return create_if_block$a;
    		return create_else_block$9;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	cartview = new Cart_view({ $$inline: true });

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			ul = element("ul");
    			li = element("li");
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			if_block.c();
    			t1 = space();
    			create_component(cartview.$$.fragment);
    			attr_dev(img, "class", "logo svelte-1fhpg");
    			attr_dev(img, "alt", "Medusa logo in navbar");
    			if (!src_url_equal(img.src, img_src_value = "https://res.cloudinary.com/dkfptto8m/image/upload/v1636640334/medusa-logo.jpg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$j, 28, 10, 655);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "svelte-1fhpg");
    			add_location(a, file$j, 27, 8, 632);
    			attr_dev(li, "class", "svelte-1fhpg");
    			add_location(li, file$j, 26, 6, 619);
    			attr_dev(ul, "class", "header-items svelte-1fhpg");
    			add_location(ul, file$j, 25, 4, 587);
    			attr_dev(div, "class", "header-ctn svelte-1fhpg");
    			add_location(div, file$j, 24, 2, 558);
    			add_location(nav, file$j, 23, 0, 550);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, ul);
    			append_dev(ul, li);
    			append_dev(li, a);
    			append_dev(a, img);
    			append_dev(ul, t0);
    			if_block.m(ul, null);
    			append_dev(nav, t1);
    			mount_component(cartview, nav, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cartview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cartview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if_block.d();
    			destroy_component(cartview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);
    	let { hideCartControls } = $$props;
    	let userCart = [];
    	let isLoading;
    	let checkoutVisibility;

    	checkoutState.subscribe(state => {
    		checkoutVisibility = state;
    	});

    	medusaCartState.subscribe(state => {
    		if (state.cart.items) {
    			$$invalidate(1, userCart = state.cart);
    			$$invalidate(2, isLoading = true);
    		}
    	});

    	const writable_props = ['hideCartControls'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setCheckoutState(true);

    	$$self.$$set = $$props => {
    		if ('hideCartControls' in $$props) $$invalidate(0, hideCartControls = $$props.hideCartControls);
    	};

    	$$self.$capture_state = () => ({
    		medusaCartState,
    		checkoutState,
    		setCheckoutState,
    		quantity,
    		sum,
    		CartView: Cart_view,
    		hideCartControls,
    		userCart,
    		isLoading,
    		checkoutVisibility
    	});

    	$$self.$inject_state = $$props => {
    		if ('hideCartControls' in $$props) $$invalidate(0, hideCartControls = $$props.hideCartControls);
    		if ('userCart' in $$props) $$invalidate(1, userCart = $$props.userCart);
    		if ('isLoading' in $$props) $$invalidate(2, isLoading = $$props.isLoading);
    		if ('checkoutVisibility' in $$props) checkoutVisibility = $$props.checkoutVisibility;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hideCartControls, userCart, isLoading, click_handler];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { hideCartControls: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hideCartControls*/ ctx[0] === undefined && !('hideCartControls' in props)) {
    			console.warn("<Nav> was created without expected prop 'hideCartControls'");
    		}
    	}

    	get hideCartControls() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideCartControls(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/wrapper.svelte generated by Svelte v3.44.1 */

    const file$i = "src/routes/wrapper.svelte";

    function create_fragment$k(ctx) {
    	let link;
    	let t;
    	let main;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			link = element("link");
    			t = space();
    			main = element("main");
    			if (default_slot) default_slot.c();
    			attr_dev(link, "href", "https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file$i, 1, 2, 16);
    			add_location(main, file$i, 7, 0, 130);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Wrapper', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Wrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Wrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wrapper",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    const medusaClient = createClient();

    const medusaShipping = writable([]);
    const medusaPayment = writable([]);
    const medusaProductStore = writable({
        allProducts: [],
        product: null
    });

    const retrieveAllProducts = async () => {
        try {
            const {data} = await medusaClient.products.list();

            medusaProductStore.update((value) => {
                value.allProducts = data.products;

                return value
            });
        } catch (e) {
            console.log(e);
        }
    };

    const retrieveProduct = async productId => {
        try {
            const {data} = await medusaClient.products.retrieve(productId);
            medusaProductStore.update((value) => {
                value.product = data.product;

                return value
            });
        } catch (e) {
            console.log(`Error fetching product: ${e}`);
        }
    };


    const getShippingOptions = async () => {
        try {
            const cartId = retrieveCartId();
            const {data} = await medusaClient.shippingOptions.list(cartId);
            medusaShipping.update(state => {
                state = data.shipping_options;

                return state
            });
        } catch (e) {
            console.log(`Error retrieving shipping_id: ${e}`);
        }
    };

    const setShippingMethod = async (shippingOptionId) => {
        try {

            const cartId = retrieveCartId();
            await medusaClient.carts.addShippingMethod(cartId, {
                option_id: shippingOptionId
            });

        } catch (e) {
            console.log(`Error setting shipping method: ${e}`);
        }
    };

    const startPaymentSession = async () => {
        try {
            const cartId = retrieveCartId();
            const {data} = await medusaClient.carts.createPaymentSessions(cartId);

            medusaPayment.update(state => {
                state = data;

                return state
            });
        } catch (e) {
            console.log(`Error starting payment session: ${e}`);
        }
    };

    const setPaymentSession = async (paymentProvider) => {
        try {
            const cartId = retrieveCartId();

            await medusaClient.carts.setPaymentSession(cartId, {
                provider_id: paymentProvider
            });

        } catch (e) {
            console.log(`Error starting payment session: ${e}`);
        }
    };

    /* src/routes/checkout/deliveryStep.svelte generated by Svelte v3.44.1 */

    const { console: console_1$3 } = globals;

    const file$h = "src/routes/checkout/deliveryStep.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (74:2) {:else}
    function create_else_block$8(ctx) {
    	let div6;
    	let div2;
    	let div1;
    	let p0;
    	let t1;
    	let p1;
    	let t2_value = /*userShippingAddress*/ ctx[3].first_name + "";
    	let t2;
    	let t3_value = " " + "";
    	let t3;
    	let t4_value = /*userShippingAddress*/ ctx[3].last_name + "";
    	let t4;
    	let t5;
    	let div0;
    	let t7;
    	let div5;
    	let div4;
    	let p2;
    	let t9;
    	let p3;
    	let t10_value = /*userShippingAddress*/ ctx[3].address_1 + "";
    	let t10;
    	let t11;
    	let t12_value = /*userShippingAddress*/ ctx[3].postal_code + "";
    	let t12;
    	let t13;
    	let t14_value = /*userShippingAddress*/ ctx[3].city + "";
    	let t14;
    	let t15;
    	let div3;
    	let t17;
    	let t18;
    	let h2;
    	let t20;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*hasSelectedShipping*/ ctx[4] && create_if_block_2$2(ctx);
    	let if_block1 = !/*hasSelectedShipping*/ ctx[4] && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Contact";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = text(t4_value);
    			t5 = space();
    			div0 = element("div");
    			div0.textContent = "Edit";
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			p2 = element("p");
    			p2.textContent = "Address";
    			t9 = space();
    			p3 = element("p");
    			t10 = text(t10_value);
    			t11 = text(", ");
    			t12 = text(t12_value);
    			t13 = space();
    			t14 = text(t14_value);
    			t15 = space();
    			div3 = element("div");
    			div3.textContent = "Edit";
    			t17 = space();
    			if (if_block0) if_block0.c();
    			t18 = space();
    			h2 = element("h2");
    			h2.textContent = "Delivery";
    			t20 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			add_location(p0, file$h, 77, 10, 2005);
    			add_location(p1, file$h, 78, 10, 2030);
    			attr_dev(div0, "class", "cursor-pointer");
    			add_location(div0, file$h, 81, 10, 2140);
    			attr_dev(div1, "class", "flex justify-between");
    			set_style(div1, "width", "100%");
    			add_location(div1, file$h, 76, 8, 1939);
    			attr_dev(div2, "class", "step-ctn svelte-14e5u6o");
    			add_location(div2, file$h, 75, 6, 1908);
    			add_location(p2, file$h, 92, 10, 2439);
    			add_location(p3, file$h, 93, 10, 2464);
    			attr_dev(div3, "class", "cursor-pointer");
    			add_location(div3, file$h, 97, 10, 2611);
    			attr_dev(div4, "class", "flex justify-between");
    			set_style(div4, "width", "100%");
    			add_location(div4, file$h, 91, 8, 2373);
    			attr_dev(div5, "class", "step-ctn svelte-14e5u6o");
    			add_location(div5, file$h, 90, 6, 2342);
    			attr_dev(div6, "class", "mb-5 mt-5");
    			add_location(div6, file$h, 74, 4, 1878);
    			attr_dev(h2, "class", "font-semibold text-2xl mb-5 mt-5");
    			add_location(h2, file$h, 117, 4, 3140);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t1);
    			append_dev(div1, p1);
    			append_dev(p1, t2);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p2);
    			append_dev(div4, t9);
    			append_dev(div4, p3);
    			append_dev(p3, t10);
    			append_dev(p3, t11);
    			append_dev(p3, t12);
    			append_dev(p3, t13);
    			append_dev(p3, t14);
    			append_dev(div4, t15);
    			append_dev(div4, div3);
    			append_dev(div6, t17);
    			if (if_block0) if_block0.m(div6, null);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t20, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(div3, "click", /*click_handler_1*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*userShippingAddress*/ 8) && t2_value !== (t2_value = /*userShippingAddress*/ ctx[3].first_name + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*userShippingAddress*/ 8) && t4_value !== (t4_value = /*userShippingAddress*/ ctx[3].last_name + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*userShippingAddress*/ 8) && t10_value !== (t10_value = /*userShippingAddress*/ ctx[3].address_1 + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*userShippingAddress*/ 8) && t12_value !== (t12_value = /*userShippingAddress*/ ctx[3].postal_code + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*userShippingAddress*/ 8) && t14_value !== (t14_value = /*userShippingAddress*/ ctx[3].city + "")) set_data_dev(t14, t14_value);

    			if (/*hasSelectedShipping*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*hasSelectedShipping*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div6, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*hasSelectedShipping*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*hasSelectedShipping*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t20);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(74:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (70:2) {#if shippingLoader}
    function create_if_block$9(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Loading steps ....";
    			add_location(p, file$h, 71, 6, 1827);
    			add_location(div, file$h, 70, 4, 1815);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(70:2) {#if shippingLoader}",
    		ctx
    	});

    	return block;
    }

    // (107:6) {#if hasSelectedShipping}
    function create_if_block_2$2(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t2_value = /*selectedShippingOption*/ ctx[1].name + "";
    	let t2;
    	let t3;
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				class: "cursor-pointer",
    				to: "/checkout",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Contact";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			create_component(link.$$.fragment);
    			add_location(p0, file$h, 109, 12, 2948);
    			add_location(p1, file$h, 110, 12, 2975);
    			attr_dev(div0, "class", "flex justify-between");
    			set_style(div0, "width", "100%");
    			add_location(div0, file$h, 108, 10, 2880);
    			attr_dev(div1, "class", "step-ctn svelte-14e5u6o");
    			add_location(div1, file$h, 107, 8, 2847);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(p1, t2);
    			append_dev(div0, t3);
    			mount_component(link, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*selectedShippingOption*/ 2) && t2_value !== (t2_value = /*selectedShippingOption*/ ctx[1].name + "")) set_data_dev(t2, t2_value);
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(107:6) {#if hasSelectedShipping}",
    		ctx
    	});

    	return block;
    }

    // (112:12) <Link class="cursor-pointer" to="/checkout">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Edit");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(112:12) <Link class=\\\"cursor-pointer\\\" to=\\\"/checkout\\\">",
    		ctx
    	});

    	return block;
    }

    // (119:4) {#if !hasSelectedShipping}
    function create_if_block_1$3(ctx) {
    	let div;
    	let current;
    	let each_value = /*shippingOptions*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "mb-5 mt-5");
    			add_location(div, file$h, 119, 6, 3236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedShippingOption, shippingOptions, setDeliveryOption*/ 35) {
    				each_value = /*shippingOptions*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(119:4) {#if !hasSelectedShipping}",
    		ctx
    	});

    	return block;
    }

    // (132:14) <Link class="cursor-pointer" to="/checkout">
    function create_default_slot$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Edit");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(132:14) <Link class=\\\"cursor-pointer\\\" to=\\\"/checkout\\\">",
    		ctx
    	});

    	return block;
    }

    // (121:8) {#each shippingOptions as option}
    function create_each_block$6(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t2_value = /*option*/ ctx[9].name + "";
    	let t2;
    	let t3;
    	let link;
    	let t4;
    	let div1_style_value;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link({
    			props: {
    				class: "cursor-pointer",
    				to: "/checkout",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[8](/*option*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Shipping";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			create_component(link.$$.fragment);
    			t4 = space();
    			add_location(p0, file$h, 129, 14, 3647);
    			add_location(p1, file$h, 130, 14, 3677);
    			attr_dev(div0, "class", "flex justify-between");
    			set_style(div0, "width", "100%");
    			add_location(div0, file$h, 128, 12, 3577);
    			attr_dev(div1, "class", "step-ctn cursor-pointer svelte-14e5u6o");
    			attr_dev(div1, "style", div1_style_value = `width: 100%; border: ${/*selectedShippingOption*/ ctx[1].id === /*option*/ ctx[9].id && "2px solid #383e46"}`);
    			add_location(div1, file$h, 121, 10, 3312);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(p1, t2);
    			append_dev(div0, t3);
    			mount_component(link, div0, null);
    			append_dev(div1, t4);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*shippingOptions*/ 1) && t2_value !== (t2_value = /*option*/ ctx[9].name + "")) set_data_dev(t2, t2_value);
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (!current || dirty & /*selectedShippingOption, shippingOptions*/ 3 && div1_style_value !== (div1_style_value = `width: 100%; border: ${/*selectedShippingOption*/ ctx[1].id === /*option*/ ctx[9].id && "2px solid #383e46"}`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(link);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(121:8) {#each shippingOptions as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*shippingLoader*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$h, 68, 0, 1782);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DeliveryStep', slots, []);
    	let shippingOptions = [];
    	let selectedShippingOption = [];
    	let shippingLoader = true;
    	let userShippingAddress = [];
    	let hasSelectedShipping;
    	onMount(async () => await getShippingOptions());

    	checkoutStore.subscribe(state => {
    		// set `selectedShippingOption` with default
    		// shippingMethod when a user moves to next step by button click
    		if (state.currentCheckoutStep === "Payment") {
    			$$invalidate(1, selectedShippingOption = shippingOptions[0]);
    		}

    		$$invalidate(4, hasSelectedShipping = state.hasSelectedShipping);
    	});

    	medusaShipping.subscribe(state => {
    		$$invalidate(0, shippingOptions = state);

    		if (state.length > 0 && !selectedShippingOption) {
    			// Selects the first available shipping option
    			$$invalidate(1, selectedShippingOption = state[0]);

    			setShippingMethod(state[0].id);
    		}
    	});

    	medusaCartState.subscribe(state => {
    		if (state.cart.shipping_address) {
    			$$invalidate(3, userShippingAddress = state.cart.shipping_address);
    			$$invalidate(2, shippingLoader = false);
    		}
    	});

    	const setDeliveryOption = async option => {
    		try {
    			$$invalidate(1, selectedShippingOption = option);

    			// Don't reselect a shipping method when a default method has been
    			// preselected
    			if (!selectedShippingOption) {
    				await setShippingMethod(option.id);
    			}

    			updateCheckoutStore({
    				hasSelectedShipping: true,
    				currentStep: "Payment"
    			});
    		} catch(e) {
    			console.log(e);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<DeliveryStep> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => updateCheckoutStore({ currentStep: "Information" });
    	const click_handler_1 = () => updateCheckoutStore({ currentStep: "Information" });
    	const click_handler_2 = option => setDeliveryOption(option);

    	$$self.$capture_state = () => ({
    		onMount,
    		Link,
    		medusaCartState,
    		checkoutStore,
    		updateCheckoutStore,
    		getShippingOptions,
    		medusaShipping,
    		setShippingMethod,
    		shippingOptions,
    		selectedShippingOption,
    		shippingLoader,
    		userShippingAddress,
    		hasSelectedShipping,
    		setDeliveryOption
    	});

    	$$self.$inject_state = $$props => {
    		if ('shippingOptions' in $$props) $$invalidate(0, shippingOptions = $$props.shippingOptions);
    		if ('selectedShippingOption' in $$props) $$invalidate(1, selectedShippingOption = $$props.selectedShippingOption);
    		if ('shippingLoader' in $$props) $$invalidate(2, shippingLoader = $$props.shippingLoader);
    		if ('userShippingAddress' in $$props) $$invalidate(3, userShippingAddress = $$props.userShippingAddress);
    		if ('hasSelectedShipping' in $$props) $$invalidate(4, hasSelectedShipping = $$props.hasSelectedShipping);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		shippingOptions,
    		selectedShippingOption,
    		shippingLoader,
    		userShippingAddress,
    		hasSelectedShipping,
    		setDeliveryOption,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class DeliveryStep extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DeliveryStep",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    const key = {};

    var has$1 = Object.prototype.hasOwnProperty;

    function dequal(foo, bar) {
    	var ctor, len;
    	if (foo === bar) return true;

    	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
    		if (ctor === Date) return foo.getTime() === bar.getTime();
    		if (ctor === RegExp) return foo.toString() === bar.toString();

    		if (ctor === Array) {
    			if ((len=foo.length) === bar.length) {
    				while (len-- && dequal(foo[len], bar[len]));
    			}
    			return len === -1;
    		}

    		if (!ctor || typeof foo === 'object') {
    			len = 0;
    			for (ctor in foo) {
    				if (has$1.call(foo, ctor) && ++len && !has$1.call(bar, ctor)) return false;
    				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
    			}
    			return Object.keys(bar).length === len;
    		}
    	}

    	return foo !== foo && bar !== bar;
    }

    function subscribeOnce(observable) {
      return new Promise((resolve) => {
        observable.subscribe(resolve)(); // immediately invoke to unsubscribe
      });
    }

    function update(object, path, value) {
      object.update((o) => {
        set$1(o, path, value);
        return o;
      });
    }

    function cloneDeep(object) {
      return JSON.parse(JSON.stringify(object));
    }

    function isNullish(value) {
      return value === undefined || value === null;
    }

    function isEmpty(object) {
      return isNullish(object) || Object.keys(object).length <= 0;
    }

    function getValues(object) {
      let results = [];

      for (const [, value] of Object.entries(object)) {
        const values = typeof value === 'object' ? getValues(value) : [value];
        results = [...results, ...values];
      }

      return results;
    }

    // TODO: refactor this so as not to rely directly on yup's API
    // This should use dependency injection, with a default callback which may assume
    // yup as the validation schema
    function getErrorsFromSchema(initialValues, schema, errors = {}) {
      for (const key in schema) {
        switch (true) {
          case schema[key].type === 'object' && !isEmpty(schema[key].fields): {
            errors[key] = getErrorsFromSchema(
              initialValues[key],
              schema[key].fields,
              {...errors[key]},
            );
            break;
          }

          case schema[key].type === 'array': {
            const values =
              initialValues && initialValues[key] ? initialValues[key] : [];
            errors[key] = values.map((value) => {
              const innerError = getErrorsFromSchema(
                value,
                schema[key].innerType.fields,
                {...errors[key]},
              );

              return Object.keys(innerError).length > 0 ? innerError : '';
            });
            break;
          }

          default: {
            errors[key] = '';
          }
        }
      }

      return errors;
    }

    const deepEqual = dequal;

    function assignDeep(object, value) {
      if (Array.isArray(object)) {
        return object.map((o) => assignDeep(o, value));
      }
      const copy = {};
      for (const key in object) {
        copy[key] =
          typeof object[key] === 'object' && !isNullish(object[key]) ? assignDeep(object[key], value) : value;
      }
      return copy;
    }

    function set$1(object, path, value) {
      if (new Object(object) !== object) return object;

      if (!Array.isArray(path)) {
        path = path.toString().match(/[^.[\]]+/g) || [];
      }

      const result = path
        .slice(0, -1)
        // TODO: replace this reduce with something more readable
        // eslint-disable-next-line unicorn/no-array-reduce
        .reduce(
          (accumulator, key, index) =>
            new Object(accumulator[key]) === accumulator[key]
              ? accumulator[key]
              : (accumulator[key] =
                  Math.trunc(Math.abs(path[index + 1])) === +path[index + 1]
                    ? []
                    : {}),
          object,
        );

      result[path[path.length - 1]] = value;

      return object;
    }

    const util = {
      assignDeep,
      cloneDeep,
      deepEqual,
      getErrorsFromSchema,
      getValues,
      isEmpty,
      isNullish,
      set: set$1,
      subscribeOnce,
      update,
    };

    const NO_ERROR = '';
    const IS_TOUCHED = true;

    function isCheckbox(element) {
      return element.getAttribute && element.getAttribute('type') === 'checkbox';
    }

    function isFileInput(element) {
      return element.getAttribute && element.getAttribute('type') === 'file';
    }

    function resolveValue(element) {
      if (isFileInput(element)) {
        return element.files;
      } else if (isCheckbox(element)) {
        return element.checked;
      } else {
        return element.value;
      }
    }

    const createForm = (config) => {
      let initialValues = config.initialValues || {};

      const validationSchema = config.validationSchema;
      const validateFunction = config.validate;
      const onSubmit = config.onSubmit;

      const getInitial = {
        values: () => util.cloneDeep(initialValues),
        errors: () =>
          validationSchema
            ? util.getErrorsFromSchema(initialValues, validationSchema.fields)
            : util.assignDeep(initialValues, NO_ERROR),
        touched: () => util.assignDeep(initialValues, !IS_TOUCHED),
      };

      const form = writable(getInitial.values());
      const errors = writable(getInitial.errors());
      const touched = writable(getInitial.touched());

      const isSubmitting = writable(false);
      const isValidating = writable(false);

      const isValid = derived(errors, ($errors) => {
        const noErrors = util
          .getValues($errors)
          .every((field) => field === NO_ERROR);
        return noErrors;
      });

      const modified = derived(form, ($form) => {
        const object = util.assignDeep($form, false);

        for (let key in $form) {
          object[key] = !util.deepEqual($form[key], initialValues[key]);
        }

        return object;
      });

      const isModified = derived(modified, ($modified) => {
        return util.getValues($modified).includes(true);
      });

      function validateField(field) {
        return util
          .subscribeOnce(form)
          .then((values) => validateFieldValue(field, values[field]));
      }

      function validateFieldValue(field, value) {
        updateTouched(field, true);

        if (validationSchema) {
          isValidating.set(true);

          return validationSchema
            .validateAt(field, get_store_value(form))
            .then(() => util.update(errors, field, ''))
            .catch((error) => util.update(errors, field, error.message))
            .finally(() => {
              isValidating.set(false);
            });
        }

        if (validateFunction) {
          isValidating.set(true);
          return Promise.resolve()
            .then(() => validateFunction({[field]: value}))
            .then((errs) =>
              util.update(errors, field, !util.isNullish(errs) ? errs[field] : ''),
            )
            .finally(() => {
              isValidating.set(false);
            });
        }

        return Promise.resolve();
      }

      function updateValidateField(field, value) {
        updateField(field, value);
        return validateFieldValue(field, value);
      }

      function handleChange(event) {
        const element = event.target;
        const field = element.name || element.id;
        const value = resolveValue(element);

        return updateValidateField(field, value);
      }

      function handleSubmit(event) {
        if (event && event.preventDefault) {
          event.preventDefault();
        }

        isSubmitting.set(true);

        return util.subscribeOnce(form).then((values) => {
          if (typeof validateFunction === 'function') {
            isValidating.set(true);

            return Promise.resolve()
              .then(() => validateFunction(values))
              .then((error) => {
                if (util.isNullish(error) || util.getValues(error).length === 0) {
                  clearErrorsAndSubmit(values);
                } else {
                  errors.set(error);
                  isSubmitting.set(false);
                }
              })
              .finally(() => isValidating.set(false));
          }

          if (validationSchema) {
            isValidating.set(true);

            return (
              validationSchema
                .validate(values, {abortEarly: false})
                .then(() => clearErrorsAndSubmit(values))
                // eslint-disable-next-line unicorn/catch-error-name
                .catch((yupErrors) => {
                  if (yupErrors && yupErrors.inner) {
                    const updatedErrors = getInitial.errors();

                    yupErrors.inner.map((error) =>
                      util.set(updatedErrors, error.path, error.message),
                    );

                    errors.set(updatedErrors);
                  }
                  isSubmitting.set(false);
                })
                .finally(() => isValidating.set(false))
            );
          }

          clearErrorsAndSubmit(values);
        });
      }

      function handleReset() {
        form.set(getInitial.values());
        errors.set(getInitial.errors());
        touched.set(getInitial.touched());
      }

      function clearErrorsAndSubmit(values) {
        return Promise.resolve()
          .then(() => errors.set(getInitial.errors()))
          .then(() => onSubmit(values, form, errors))
          .finally(() => isSubmitting.set(false));
      }

      /**
       * Handler to imperatively update the value of a form field
       */
      function updateField(field, value) {
        util.update(form, field, value);
      }

      /**
       * Handler to imperatively update the touched value of a form field
       */
      function updateTouched(field, value) {
        util.update(touched, field, value);
      }

      /**
       * Update the initial values and reset form. Used to dynamically display new form values
       */
      function updateInitialValues(newValues) {
        initialValues = newValues;

        handleReset();
      }

      return {
        form,
        errors,
        touched,
        modified,
        isValid,
        isSubmitting,
        isValidating,
        isModified,
        handleChange,
        handleSubmit,
        handleReset,
        updateField,
        updateValidateField,
        updateTouched,
        validateField,
        updateInitialValues,
        state: derived(
          [
            form,
            errors,
            touched,
            modified,
            isValid,
            isValidating,
            isSubmitting,
            isModified,
          ],
          ([
            $form,
            $errors,
            $touched,
            $modified,
            $isValid,
            $isValidating,
            $isSubmitting,
            $isModified,
          ]) => ({
            form: $form,
            errors: $errors,
            touched: $touched,
            modified: $modified,
            isValid: $isValid,
            isSubmitting: $isSubmitting,
            isValidating: $isValidating,
            isModified: $isModified,
          }),
        ),
      };
    };

    /* node_modules/svelte-forms-lib/lib/components/Form.svelte generated by Svelte v3.44.1 */

    const { Error: Error_1 } = globals;
    const file$g = "node_modules/svelte-forms-lib/lib/components/Form.svelte";
    const get_default_slot_changes = dirty => ({});

    const get_default_slot_context = ctx => ({
    	form: /*form*/ ctx[0],
    	errors: /*errors*/ ctx[1],
    	touched: /*touched*/ ctx[2],
    	state: /*state*/ ctx[3],
    	handleChange: /*handleChange*/ ctx[4],
    	handleSubmit: /*handleSubmit*/ ctx[5],
    	updateField: /*updateField*/ ctx[6],
    	updateInitialValues: /*updateInitialValues*/ ctx[7],
    	updateTouched: /*updateTouched*/ ctx[8],
    	updateValidateField: /*updateValidateField*/ ctx[9],
    	validateField: /*validateField*/ ctx[10]
    });

    function create_fragment$i(ctx) {
    	let form_1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], get_default_slot_context);
    	let form_1_levels = [/*$$restProps*/ ctx[11]];
    	let form_1_data = {};

    	for (let i = 0; i < form_1_levels.length; i += 1) {
    		form_1_data = assign(form_1_data, form_1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			form_1 = element("form");
    			if (default_slot) default_slot.c();
    			set_attributes(form_1, form_1_data);
    			add_location(form_1, file$g, 49, 0, 921);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form_1, anchor);

    			if (default_slot) {
    				default_slot.m(form_1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form_1, "submit", /*handleSubmit*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 131072)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			set_attributes(form_1, form_1_data = get_spread_update(form_1_levels, [dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form_1);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	const omit_props_names = ["initialValues","validate","validationSchema","onSubmit","context"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form', slots, ['default']);
    	let { initialValues = {} } = $$props;
    	let { validate = null } = $$props;
    	let { validationSchema = null } = $$props;

    	let { onSubmit = () => {
    		throw new Error('onSubmit is a required property in <Form /> when using the fallback context');
    	} } = $$props;

    	let { context = createForm({
    		initialValues,
    		onSubmit,
    		validate,
    		validationSchema
    	}) } = $$props;

    	const { form, errors, touched, state, handleChange, handleSubmit, updateField, updateInitialValues, updateTouched, updateValidateField, validateField } = context;

    	setContext(key, {
    		form,
    		errors,
    		touched,
    		state,
    		handleChange,
    		handleSubmit,
    		updateField,
    		updateInitialValues,
    		updateTouched,
    		updateValidateField,
    		validateField
    	});

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('initialValues' in $$new_props) $$invalidate(12, initialValues = $$new_props.initialValues);
    		if ('validate' in $$new_props) $$invalidate(13, validate = $$new_props.validate);
    		if ('validationSchema' in $$new_props) $$invalidate(14, validationSchema = $$new_props.validationSchema);
    		if ('onSubmit' in $$new_props) $$invalidate(15, onSubmit = $$new_props.onSubmit);
    		if ('context' in $$new_props) $$invalidate(16, context = $$new_props.context);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		createForm,
    		key,
    		initialValues,
    		validate,
    		validationSchema,
    		onSubmit,
    		context,
    		form,
    		errors,
    		touched,
    		state,
    		handleChange,
    		handleSubmit,
    		updateField,
    		updateInitialValues,
    		updateTouched,
    		updateValidateField,
    		validateField
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('initialValues' in $$props) $$invalidate(12, initialValues = $$new_props.initialValues);
    		if ('validate' in $$props) $$invalidate(13, validate = $$new_props.validate);
    		if ('validationSchema' in $$props) $$invalidate(14, validationSchema = $$new_props.validationSchema);
    		if ('onSubmit' in $$props) $$invalidate(15, onSubmit = $$new_props.onSubmit);
    		if ('context' in $$props) $$invalidate(16, context = $$new_props.context);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		form,
    		errors,
    		touched,
    		state,
    		handleChange,
    		handleSubmit,
    		updateField,
    		updateInitialValues,
    		updateTouched,
    		updateValidateField,
    		validateField,
    		$$restProps,
    		initialValues,
    		validate,
    		validationSchema,
    		onSubmit,
    		context,
    		$$scope,
    		slots
    	];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			initialValues: 12,
    			validate: 13,
    			validationSchema: 14,
    			onSubmit: 15,
    			context: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get initialValues() {
    		throw new Error_1("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialValues(value) {
    		throw new Error_1("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validate() {
    		throw new Error_1("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set validate(value) {
    		throw new Error_1("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validationSchema() {
    		throw new Error_1("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set validationSchema(value) {
    		throw new Error_1("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSubmit() {
    		throw new Error_1("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSubmit(value) {
    		throw new Error_1("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get context() {
    		throw new Error_1("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set context(value) {
    		throw new Error_1("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-forms-lib/lib/components/Field.svelte generated by Svelte v3.44.1 */
    const file$f = "node_modules/svelte-forms-lib/lib/components/Field.svelte";

    function create_fragment$h(ctx) {
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ name: /*name*/ ctx[0] },
    		{ type: /*type*/ ctx[1] },
    		{
    			value: input_value_value = /*$form*/ ctx[2][/*name*/ ctx[0]]
    		},
    		/*$$props*/ ctx[5]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$f, 10, 0, 183);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.value = input_data.value;
    			if (input.autofocus) input.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*handleChange*/ ctx[4], false, false, false),
    					listen_dev(input, "blur", /*handleChange*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty & /*name*/ 1 && { name: /*name*/ ctx[0] },
    				dirty & /*type*/ 2 && { type: /*type*/ ctx[1] },
    				dirty & /*$form, name*/ 5 && input_value_value !== (input_value_value = /*$form*/ ctx[2][/*name*/ ctx[0]]) && input.value !== input_value_value && { value: input_value_value },
    				dirty & /*$$props*/ 32 && /*$$props*/ ctx[5]
    			]));

    			if ('value' in input_data) {
    				input.value = input_data.value;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $form;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Field', slots, []);
    	let { name } = $$props;
    	let { type = 'text' } = $$props;
    	const { form, handleChange } = getContext(key);
    	validate_store(form, 'form');
    	component_subscribe($$self, form, value => $$invalidate(2, $form = value));

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('name' in $$new_props) $$invalidate(0, name = $$new_props.name);
    		if ('type' in $$new_props) $$invalidate(1, type = $$new_props.type);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		key,
    		name,
    		type,
    		form,
    		handleChange,
    		$form
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('name' in $$props) $$invalidate(0, name = $$new_props.name);
    		if ('type' in $$props) $$invalidate(1, type = $$new_props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [name, type, $form, form, handleChange, $$props];
    }

    class Field extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { name: 0, type: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Field",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Field> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-forms-lib/lib/components/ErrorMessage.svelte generated by Svelte v3.44.1 */
    const file$e = "node_modules/svelte-forms-lib/lib/components/ErrorMessage.svelte";

    // (10:0) {#if $errors[name]}
    function create_if_block$8(ctx) {
    	let small;
    	let t_value = /*$errors*/ ctx[1][/*name*/ ctx[0]] + "";
    	let t;
    	let small_levels = [/*$$props*/ ctx[3]];
    	let small_data = {};

    	for (let i = 0; i < small_levels.length; i += 1) {
    		small_data = assign(small_data, small_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			small = element("small");
    			t = text(t_value);
    			set_attributes(small, small_data);
    			add_location(small, file$e, 10, 2, 165);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			append_dev(small, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$errors, name*/ 3 && t_value !== (t_value = /*$errors*/ ctx[1][/*name*/ ctx[0]] + "")) set_data_dev(t, t_value);
    			set_attributes(small, small_data = get_spread_update(small_levels, [dirty & /*$$props*/ 8 && /*$$props*/ ctx[3]]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(10:0) {#if $errors[name]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let if_block_anchor;
    	let if_block = /*$errors*/ ctx[1][/*name*/ ctx[0]] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$errors*/ ctx[1][/*name*/ ctx[0]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $errors;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ErrorMessage', slots, []);
    	let { name } = $$props;
    	const { errors } = getContext(key);
    	validate_store(errors, 'errors');
    	component_subscribe($$self, errors, value => $$invalidate(1, $errors = value));

    	$$self.$$set = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('name' in $$new_props) $$invalidate(0, name = $$new_props.name);
    	};

    	$$self.$capture_state = () => ({ getContext, key, name, errors, $errors });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
    		if ('name' in $$props) $$invalidate(0, name = $$new_props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [name, $errors, errors, $$props];
    }

    class ErrorMessage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ErrorMessage",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<ErrorMessage> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<ErrorMessage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ErrorMessage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // ES6 Map
    var map;
    try {
      map = Map;
    } catch (_) { }
    var set;

    // ES6 Set
    try {
      set = Set;
    } catch (_) { }

    function baseClone (src, circulars, clones) {
      // Null/undefined/functions/etc
      if (!src || typeof src !== 'object' || typeof src === 'function') {
        return src
      }

      // DOM Node
      if (src.nodeType && 'cloneNode' in src) {
        return src.cloneNode(true)
      }

      // Date
      if (src instanceof Date) {
        return new Date(src.getTime())
      }

      // RegExp
      if (src instanceof RegExp) {
        return new RegExp(src)
      }

      // Arrays
      if (Array.isArray(src)) {
        return src.map(clone)
      }

      // ES6 Maps
      if (map && src instanceof map) {
        return new Map(Array.from(src.entries()))
      }

      // ES6 Sets
      if (set && src instanceof set) {
        return new Set(Array.from(src.values()))
      }

      // Object
      if (src instanceof Object) {
        circulars.push(src);
        var obj = Object.create(src);
        clones.push(obj);
        for (var key in src) {
          var idx = circulars.findIndex(function (i) {
            return i === src[key]
          });
          obj[key] = idx > -1 ? clones[idx] : baseClone(src[key], circulars, clones);
        }
        return obj
      }

      // ???
      return src
    }

    function clone (src) {
      return baseClone(src, [], [])
    }

    const toString$1 = Object.prototype.toString;
    const errorToString = Error.prototype.toString;
    const regExpToString = RegExp.prototype.toString;
    const symbolToString$1 = typeof Symbol !== 'undefined' ? Symbol.prototype.toString : () => '';
    const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

    function printNumber(val) {
      if (val != +val) return 'NaN';
      const isNegativeZero = val === 0 && 1 / val < 0;
      return isNegativeZero ? '-0' : '' + val;
    }

    function printSimpleValue(val, quoteStrings = false) {
      if (val == null || val === true || val === false) return '' + val;
      const typeOf = typeof val;
      if (typeOf === 'number') return printNumber(val);
      if (typeOf === 'string') return quoteStrings ? `"${val}"` : val;
      if (typeOf === 'function') return '[Function ' + (val.name || 'anonymous') + ']';
      if (typeOf === 'symbol') return symbolToString$1.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
      const tag = toString$1.call(val).slice(8, -1);
      if (tag === 'Date') return isNaN(val.getTime()) ? '' + val : val.toISOString(val);
      if (tag === 'Error' || val instanceof Error) return '[' + errorToString.call(val) + ']';
      if (tag === 'RegExp') return regExpToString.call(val);
      return null;
    }

    function printValue(value, quoteStrings) {
      let result = printSimpleValue(value, quoteStrings);
      if (result !== null) return result;
      return JSON.stringify(value, function (key, value) {
        let result = printSimpleValue(this[key], quoteStrings);
        if (result !== null) return result;
        return value;
      }, 2);
    }

    let mixed = {
      default: '${path} is invalid',
      required: '${path} is a required field',
      oneOf: '${path} must be one of the following values: ${values}',
      notOneOf: '${path} must not be one of the following values: ${values}',
      notType: ({
        path,
        type,
        value,
        originalValue
      }) => {
        let isCast = originalValue != null && originalValue !== value;
        let msg = `${path} must be a \`${type}\` type, ` + `but the final value was: \`${printValue(value, true)}\`` + (isCast ? ` (cast from the value \`${printValue(originalValue, true)}\`).` : '.');

        if (value === null) {
          msg += `\n If "null" is intended as an empty value be sure to mark the schema as \`.nullable()\``;
        }

        return msg;
      },
      defined: '${path} must be defined'
    };
    let string = {
      length: '${path} must be exactly ${length} characters',
      min: '${path} must be at least ${min} characters',
      max: '${path} must be at most ${max} characters',
      matches: '${path} must match the following: "${regex}"',
      email: '${path} must be a valid email',
      url: '${path} must be a valid URL',
      uuid: '${path} must be a valid UUID',
      trim: '${path} must be a trimmed string',
      lowercase: '${path} must be a lowercase string',
      uppercase: '${path} must be a upper case string'
    };
    let number = {
      min: '${path} must be greater than or equal to ${min}',
      max: '${path} must be less than or equal to ${max}',
      lessThan: '${path} must be less than ${less}',
      moreThan: '${path} must be greater than ${more}',
      positive: '${path} must be a positive number',
      negative: '${path} must be a negative number',
      integer: '${path} must be an integer'
    };
    let date = {
      min: '${path} field must be later than ${min}',
      max: '${path} field must be at earlier than ${max}'
    };
    let boolean = {
      isValue: '${path} field must be ${value}'
    };
    let object = {
      noUnknown: '${path} field has unspecified keys: ${unknown}'
    };
    let array$1 = {
      min: '${path} field must have at least ${min} items',
      max: '${path} field must have less than or equal to ${max} items',
      length: '${path} must have ${length} items'
    };
    var locale = Object.assign(Object.create(null), {
      mixed,
      string,
      number,
      date,
      object,
      array: array$1,
      boolean
    });

    /** Used for built-in method references. */
    var objectProto$c = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty$9.call(object, key);
    }

    var _baseHas = baseHas;

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    var isArray_1 = isArray;

    /** Detect free variable `global` from Node.js. */

    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = _freeGlobal || freeSelf || Function('return this')();

    var _root = root;

    /** Built-in value references. */
    var Symbol$1 = _root.Symbol;

    var _Symbol = Symbol$1;

    /** Used for built-in method references. */
    var objectProto$b = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$b.toString;

    /** Built-in value references. */
    var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty$8.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    var _getRawTag = getRawTag;

    /** Used for built-in method references. */
    var objectProto$a = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto$a.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    var _objectToString = objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? _getRawTag(value)
        : _objectToString(value);
    }

    var _baseGetTag = baseGetTag;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike;

    /** `Object#toString` result references. */
    var symbolTag$1 = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
    }

    var isSymbol_1 = isSymbol;

    /** Used to match property names within property paths. */
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        reIsPlainProp = /^\w*$/;

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray_1(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol_1(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    var _isKey = isKey;

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject$1(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject$1;

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag$1 = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject_1(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = _baseGetTag(value);
      return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    var isFunction_1 = isFunction;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = _root['__core-js_shared__'];

    var _coreJsData = coreJsData;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    var _isMasked = isMasked;

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString$1.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    var _toSource = toSource;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto$9 = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty$7).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject_1(value) || _isMasked(value)) {
        return false;
      }
      var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
      return pattern.test(_toSource(value));
    }

    var _baseIsNative = baseIsNative;

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    var _getValue = getValue;

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = _getValue(object, key);
      return _baseIsNative(value) ? value : undefined;
    }

    var _getNative = getNative;

    /* Built-in method references that are verified to be native. */
    var nativeCreate = _getNative(Object, 'create');

    var _nativeCreate = nativeCreate;

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
      this.size = 0;
    }

    var _hashClear = hashClear;

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    var _hashDelete = hashDelete;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (_nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED$2 ? undefined : result;
      }
      return hasOwnProperty$6.call(data, key) ? data[key] : undefined;
    }

    var _hashGet = hashGet;

    /** Used for built-in method references. */
    var objectProto$7 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$5.call(data, key);
    }

    var _hashHas = hashHas;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
      return this;
    }

    var _hashSet = hashSet;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = _hashClear;
    Hash.prototype['delete'] = _hashDelete;
    Hash.prototype.get = _hashGet;
    Hash.prototype.has = _hashHas;
    Hash.prototype.set = _hashSet;

    var _Hash = Hash;

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    var _listCacheClear = listCacheClear;

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    var eq_1 = eq;

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq_1(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    var _assocIndexOf = assocIndexOf;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    var _listCacheDelete = listCacheDelete;

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    var _listCacheGet = listCacheGet;

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return _assocIndexOf(this.__data__, key) > -1;
    }

    var _listCacheHas = listCacheHas;

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    var _listCacheSet = listCacheSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = _listCacheClear;
    ListCache.prototype['delete'] = _listCacheDelete;
    ListCache.prototype.get = _listCacheGet;
    ListCache.prototype.has = _listCacheHas;
    ListCache.prototype.set = _listCacheSet;

    var _ListCache = ListCache;

    /* Built-in method references that are verified to be native. */
    var Map$1 = _getNative(_root, 'Map');

    var _Map = Map$1;

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new _Hash,
        'map': new (_Map || _ListCache),
        'string': new _Hash
      };
    }

    var _mapCacheClear = mapCacheClear;

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    var _isKeyable = isKeyable;

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return _isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    var _getMapData = getMapData;

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = _getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    var _mapCacheDelete = mapCacheDelete;

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return _getMapData(this, key).get(key);
    }

    var _mapCacheGet = mapCacheGet;

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return _getMapData(this, key).has(key);
    }

    var _mapCacheHas = mapCacheHas;

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = _getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    var _mapCacheSet = mapCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = _mapCacheClear;
    MapCache.prototype['delete'] = _mapCacheDelete;
    MapCache.prototype.get = _mapCacheGet;
    MapCache.prototype.has = _mapCacheHas;
    MapCache.prototype.set = _mapCacheSet;

    var _MapCache = MapCache;

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || _MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = _MapCache;

    var memoize_1 = memoize;

    /** Used as the maximum memoize cache size. */
    var MAX_MEMOIZE_SIZE = 500;

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize_1(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    var _memoizeCapped = memoizeCapped;

    /** Used to match property names within property paths. */
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = _memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    var _stringToPath = stringToPath;

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    var _arrayMap = arrayMap;

    /** Used as references for various `Number` constants. */
    var INFINITY$1 = 1 / 0;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
        symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray_1(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return _arrayMap(value, baseToString) + '';
      }
      if (isSymbol_1(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
    }

    var _baseToString = baseToString;

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : _baseToString(value);
    }

    var toString_1 = toString;

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray_1(value)) {
        return value;
      }
      return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
    }

    var _castPath = castPath;

    /** `Object#toString` result references. */
    var argsTag$2 = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike_1(value) && _baseGetTag(value) == argsTag$2;
    }

    var _baseIsArguments = baseIsArguments;

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
      return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
        !propertyIsEnumerable$1.call(value, 'callee');
    };

    var isArguments_1 = isArguments;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER$1 : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    var _isIndex = isIndex;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    var isLength_1 = isLength;

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0;

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol_1(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    var _toKey = toKey;

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = _castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = _toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength_1(length) && _isIndex(key, length) &&
        (isArray_1(object) || isArguments_1(object));
    }

    var _hasPath = hasPath;

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && _hasPath(object, path, _baseHas);
    }

    var has_1 = has;

    const isSchema = obj => obj && obj.__isYupSchema__;

    class Condition {
      constructor(refs, options) {
        this.fn = void 0;
        this.refs = refs;
        this.refs = refs;

        if (typeof options === 'function') {
          this.fn = options;
          return;
        }

        if (!has_1(options, 'is')) throw new TypeError('`is:` is required for `when()` conditions');
        if (!options.then && !options.otherwise) throw new TypeError('either `then:` or `otherwise:` is required for `when()` conditions');
        let {
          is,
          then,
          otherwise
        } = options;
        let check = typeof is === 'function' ? is : (...values) => values.every(value => value === is);

        this.fn = function (...args) {
          let options = args.pop();
          let schema = args.pop();
          let branch = check(...args) ? then : otherwise;
          if (!branch) return undefined;
          if (typeof branch === 'function') return branch(schema);
          return schema.concat(branch.resolve(options));
        };
      }

      resolve(base, options) {
        let values = this.refs.map(ref => ref.getValue(options == null ? void 0 : options.value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context));
        let schema = this.fn.apply(base, values.concat(base, options));
        if (schema === undefined || schema === base) return base;
        if (!isSchema(schema)) throw new TypeError('conditions must return a schema object');
        return schema.resolve(options);
      }

    }

    function toArray(value) {
      return value == null ? [] : [].concat(value);
    }

    function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
    let strReg = /\$\{\s*(\w+)\s*\}/g;
    class ValidationError extends Error {
      static formatError(message, params) {
        const path = params.label || params.path || 'this';
        if (path !== params.path) params = _extends$4({}, params, {
          path
        });
        if (typeof message === 'string') return message.replace(strReg, (_, key) => printValue(params[key]));
        if (typeof message === 'function') return message(params);
        return message;
      }

      static isError(err) {
        return err && err.name === 'ValidationError';
      }

      constructor(errorOrErrors, value, field, type) {
        super();
        this.value = void 0;
        this.path = void 0;
        this.type = void 0;
        this.errors = void 0;
        this.params = void 0;
        this.inner = void 0;
        this.name = 'ValidationError';
        this.value = value;
        this.path = field;
        this.type = type;
        this.errors = [];
        this.inner = [];
        toArray(errorOrErrors).forEach(err => {
          if (ValidationError.isError(err)) {
            this.errors.push(...err.errors);
            this.inner = this.inner.concat(err.inner.length ? err.inner : err);
          } else {
            this.errors.push(err);
          }
        });
        this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0];
        if (Error.captureStackTrace) Error.captureStackTrace(this, ValidationError);
      }

    }

    const once = cb => {
      let fired = false;
      return (...args) => {
        if (fired) return;
        fired = true;
        cb(...args);
      };
    };

    function runTests(options, cb) {
      let {
        endEarly,
        tests,
        args,
        value,
        errors,
        sort,
        path
      } = options;
      let callback = once(cb);
      let count = tests.length;
      const nestedErrors = [];
      errors = errors ? errors : [];
      if (!count) return errors.length ? callback(new ValidationError(errors, value, path)) : callback(null, value);

      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        test(args, function finishTestRun(err) {
          if (err) {
            // always return early for non validation errors
            if (!ValidationError.isError(err)) {
              return callback(err, value);
            }

            if (endEarly) {
              err.value = value;
              return callback(err, value);
            }

            nestedErrors.push(err);
          }

          if (--count <= 0) {
            if (nestedErrors.length) {
              if (sort) nestedErrors.sort(sort); //show parent errors after the nested ones: name.first, name

              if (errors.length) nestedErrors.push(...errors);
              errors = nestedErrors;
            }

            if (errors.length) {
              callback(new ValidationError(errors, value, path), value);
              return;
            }

            callback(null, value);
          }
        });
      }
    }

    var defineProperty = (function() {
      try {
        var func = _getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    var _defineProperty = defineProperty;

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && _defineProperty) {
        _defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    var _baseAssignValue = baseAssignValue;

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    var _createBaseFor = createBaseFor;

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = _createBaseFor();

    var _baseFor = baseFor;

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    var _baseTimes = baseTimes;

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    var stubFalse_1 = stubFalse;

    var isBuffer_1 = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? _root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse_1;

    module.exports = isBuffer;
    });

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]',
        arrayTag$1 = '[object Array]',
        boolTag$1 = '[object Boolean]',
        dateTag$1 = '[object Date]',
        errorTag$1 = '[object Error]',
        funcTag = '[object Function]',
        mapTag$2 = '[object Map]',
        numberTag$1 = '[object Number]',
        objectTag$2 = '[object Object]',
        regexpTag$1 = '[object RegExp]',
        setTag$2 = '[object Set]',
        stringTag$1 = '[object String]',
        weakMapTag$1 = '[object WeakMap]';

    var arrayBufferTag$1 = '[object ArrayBuffer]',
        dataViewTag$2 = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
    typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
    typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] =
    typedArrayTags[errorTag$1] = typedArrayTags[funcTag] =
    typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] =
    typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$1] =
    typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] =
    typedArrayTags[weakMapTag$1] = false;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike_1(value) &&
        isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
    }

    var _baseIsTypedArray = baseIsTypedArray;

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    var _baseUnary = baseUnary;

    var _nodeUtil = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && _freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    module.exports = nodeUtil;
    });

    /* Node.js helper references. */
    var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

    var isTypedArray_1 = isTypedArray;

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray_1(value),
          isArg = !isArr && isArguments_1(value),
          isBuff = !isArr && !isArg && isBuffer_1(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? _baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty$3.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               _isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    var _arrayLikeKeys = arrayLikeKeys;

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

      return value === proto;
    }

    var _isPrototype = isPrototype;

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    var _overArg = overArg;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys = _overArg(Object.keys, Object);

    var _nativeKeys = nativeKeys;

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!_isPrototype(object)) {
        return _nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty$2.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeys = baseKeys;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength_1(value.length) && !isFunction_1(value);
    }

    var isArrayLike_1 = isArrayLike;

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
    }

    var keys_1 = keys;

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && _baseFor(object, iteratee, keys_1);
    }

    var _baseForOwn = baseForOwn;

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new _ListCache;
      this.size = 0;
    }

    var _stackClear = stackClear;

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    var _stackDelete = stackDelete;

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    var _stackGet = stackGet;

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    var _stackHas = stackHas;

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof _ListCache) {
        var pairs = data.__data__;
        if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new _MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    var _stackSet = stackSet;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new _ListCache(entries);
      this.size = data.size;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = _stackClear;
    Stack.prototype['delete'] = _stackDelete;
    Stack.prototype.get = _stackGet;
    Stack.prototype.has = _stackHas;
    Stack.prototype.set = _stackSet;

    var _Stack = Stack;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    var _setCacheAdd = setCacheAdd;

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    var _setCacheHas = setCacheHas;

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new _MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
    SetCache.prototype.has = _setCacheHas;

    var _SetCache = SetCache;

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    var _arraySome = arraySome;

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function cacheHas(cache, key) {
      return cache.has(key);
    }

    var _cacheHas = cacheHas;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$5 = 1,
        COMPARE_UNORDERED_FLAG$3 = 2;

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG$3) ? new _SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!_arraySome(other, function(othValue, othIndex) {
                if (!_cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    var _equalArrays = equalArrays;

    /** Built-in value references. */
    var Uint8Array = _root.Uint8Array;

    var _Uint8Array = Uint8Array;

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    var _mapToArray = mapToArray;

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
          result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    var _setToArray = setToArray;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$4 = 1,
        COMPARE_UNORDERED_FLAG$2 = 2;

    /** `Object#toString` result references. */
    var boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        mapTag$1 = '[object Map]',
        numberTag = '[object Number]',
        regexpTag = '[object RegExp]',
        setTag$1 = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag$1 = '[object DataView]';

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = _Symbol ? _Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag$1:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq_1(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag$1:
          var convert = _mapToArray;

        case setTag$1:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
          convert || (convert = _setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG$2;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    var _equalByTag = equalByTag;

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    var _arrayPush = arrayPush;

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
    }

    var _baseGetAllKeys = baseGetAllKeys;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    var _arrayFilter = arrayFilter;

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    var stubArray_1 = stubArray;

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return _arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    var _getSymbols = getSymbols;

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return _baseGetAllKeys(object, keys_1, _getSymbols);
    }

    var _getAllKeys = getAllKeys;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$3 = 1;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
          objProps = _getAllKeys(object),
          objLength = objProps.length,
          othProps = _getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    var _equalObjects = equalObjects;

    /* Built-in method references that are verified to be native. */
    var DataView = _getNative(_root, 'DataView');

    var _DataView = DataView;

    /* Built-in method references that are verified to be native. */
    var Promise$1 = _getNative(_root, 'Promise');

    var _Promise = Promise$1;

    /* Built-in method references that are verified to be native. */
    var Set$1 = _getNative(_root, 'Set');

    var _Set = Set$1;

    /* Built-in method references that are verified to be native. */
    var WeakMap = _getNative(_root, 'WeakMap');

    var _WeakMap = WeakMap;

    /** `Object#toString` result references. */
    var mapTag = '[object Map]',
        objectTag$1 = '[object Object]',
        promiseTag = '[object Promise]',
        setTag = '[object Set]',
        weakMapTag = '[object WeakMap]';

    var dataViewTag = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = _toSource(_DataView),
        mapCtorString = _toSource(_Map),
        promiseCtorString = _toSource(_Promise),
        setCtorString = _toSource(_Set),
        weakMapCtorString = _toSource(_WeakMap);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = _baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (_Map && getTag(new _Map) != mapTag) ||
        (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
        (_Set && getTag(new _Set) != setTag) ||
        (_WeakMap && getTag(new _WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = _baseGetTag(value),
            Ctor = result == objectTag$1 ? value.constructor : undefined,
            ctorString = Ctor ? _toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    var _getTag = getTag;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$2 = 1;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        objectTag = '[object Object]';

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray_1(object),
          othIsArr = isArray_1(other),
          objTag = objIsArr ? arrayTag : _getTag(object),
          othTag = othIsArr ? arrayTag : _getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer_1(object)) {
        if (!isBuffer_1(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new _Stack);
        return (objIsArr || isTypedArray_1(object))
          ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new _Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new _Stack);
      return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    var _baseIsEqualDeep = baseIsEqualDeep;

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
        return value !== value && other !== other;
      }
      return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    var _baseIsEqual = baseIsEqual;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$1 = 1,
        COMPARE_UNORDERED_FLAG$1 = 2;

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new _Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    var _baseIsMatch = baseIsMatch;

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject_1(value);
    }

    var _isStrictComparable = isStrictComparable;

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys_1(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, _isStrictComparable(value)];
      }
      return result;
    }

    var _getMatchData = getMatchData;

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    var _matchesStrictComparable = matchesStrictComparable;

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = _getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || _baseIsMatch(object, source, matchData);
      };
    }

    var _baseMatches = baseMatches;

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = _castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[_toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    var _baseGet = baseGet;

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : _baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    var get_1 = get;

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    var _baseHasIn = baseHasIn;

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && _hasPath(object, path, _baseHasIn);
    }

    var hasIn_1 = hasIn;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG = 1,
        COMPARE_UNORDERED_FLAG = 2;

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (_isKey(path) && _isStrictComparable(srcValue)) {
        return _matchesStrictComparable(_toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get_1(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn_1(object, path)
          : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    var _baseMatchesProperty = baseMatchesProperty;

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    var identity_1 = identity;

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    var _baseProperty = baseProperty;

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return _baseGet(object, path);
      };
    }

    var _basePropertyDeep = basePropertyDeep;

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
    }

    var property_1 = property;

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity_1;
      }
      if (typeof value == 'object') {
        return isArray_1(value)
          ? _baseMatchesProperty(value[0], value[1])
          : _baseMatches(value);
      }
      return property_1(value);
    }

    var _baseIteratee = baseIteratee;

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = _baseIteratee(iteratee);

      _baseForOwn(object, function(value, key, object) {
        _baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    var mapValues_1 = mapValues;

    /**
     * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
     */

    function Cache(maxSize) {
      this._maxSize = maxSize;
      this.clear();
    }
    Cache.prototype.clear = function () {
      this._size = 0;
      this._values = Object.create(null);
    };
    Cache.prototype.get = function (key) {
      return this._values[key]
    };
    Cache.prototype.set = function (key, value) {
      this._size >= this._maxSize && this.clear();
      if (!(key in this._values)) this._size++;

      return (this._values[key] = value)
    };

    var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g,
      DIGIT_REGEX = /^\d+$/,
      LEAD_DIGIT_REGEX = /^\d/,
      SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g,
      CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/,
      MAX_CACHE_SIZE = 512;

    var pathCache = new Cache(MAX_CACHE_SIZE),
      setCache = new Cache(MAX_CACHE_SIZE),
      getCache = new Cache(MAX_CACHE_SIZE);

    var propertyExpr = {
      Cache: Cache,

      split: split,

      normalizePath: normalizePath,

      setter: function (path) {
        var parts = normalizePath(path);

        return (
          setCache.get(path) ||
          setCache.set(path, function setter(obj, value) {
            var index = 0;
            var len = parts.length;
            var data = obj;

            while (index < len - 1) {
              var part = parts[index];
              if (
                part === '__proto__' ||
                part === 'constructor' ||
                part === 'prototype'
              ) {
                return obj
              }

              data = data[parts[index++]];
            }
            data[parts[index]] = value;
          })
        )
      },

      getter: function (path, safe) {
        var parts = normalizePath(path);
        return (
          getCache.get(path) ||
          getCache.set(path, function getter(data) {
            var index = 0,
              len = parts.length;
            while (index < len) {
              if (data != null || !safe) data = data[parts[index++]];
              else return
            }
            return data
          })
        )
      },

      join: function (segments) {
        return segments.reduce(function (path, part) {
          return (
            path +
            (isQuoted(part) || DIGIT_REGEX.test(part)
              ? '[' + part + ']'
              : (path ? '.' : '') + part)
          )
        }, '')
      },

      forEach: function (path, cb, thisArg) {
        forEach(Array.isArray(path) ? path : split(path), cb, thisArg);
      },
    };

    function normalizePath(path) {
      return (
        pathCache.get(path) ||
        pathCache.set(
          path,
          split(path).map(function (part) {
            return part.replace(CLEAN_QUOTES_REGEX, '$2')
          })
        )
      )
    }

    function split(path) {
      return path.match(SPLIT_REGEX)
    }

    function forEach(parts, iter, thisArg) {
      var len = parts.length,
        part,
        idx,
        isArray,
        isBracket;

      for (idx = 0; idx < len; idx++) {
        part = parts[idx];

        if (part) {
          if (shouldBeQuoted(part)) {
            part = '"' + part + '"';
          }

          isBracket = isQuoted(part);
          isArray = !isBracket && /^\d+$/.test(part);

          iter.call(thisArg, part, isBracket, isArray, idx, parts);
        }
      }
    }

    function isQuoted(str) {
      return (
        typeof str === 'string' && str && ["'", '"'].indexOf(str.charAt(0)) !== -1
      )
    }

    function hasLeadingNumber(part) {
      return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX)
    }

    function hasSpecialChars(part) {
      return SPEC_CHAR_REGEX.test(part)
    }

    function shouldBeQuoted(part) {
      return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part))
    }

    const prefixes = {
      context: '$',
      value: '.'
    };
    function create$8(key, options) {
      return new Reference(key, options);
    }
    class Reference {
      constructor(key, options = {}) {
        this.key = void 0;
        this.isContext = void 0;
        this.isValue = void 0;
        this.isSibling = void 0;
        this.path = void 0;
        this.getter = void 0;
        this.map = void 0;
        if (typeof key !== 'string') throw new TypeError('ref must be a string, got: ' + key);
        this.key = key.trim();
        if (key === '') throw new TypeError('ref must be a non-empty string');
        this.isContext = this.key[0] === prefixes.context;
        this.isValue = this.key[0] === prefixes.value;
        this.isSibling = !this.isContext && !this.isValue;
        let prefix = this.isContext ? prefixes.context : this.isValue ? prefixes.value : '';
        this.path = this.key.slice(prefix.length);
        this.getter = this.path && propertyExpr.getter(this.path, true);
        this.map = options.map;
      }

      getValue(value, parent, context) {
        let result = this.isContext ? context : this.isValue ? value : parent;
        if (this.getter) result = this.getter(result || {});
        if (this.map) result = this.map(result);
        return result;
      }
      /**
       *
       * @param {*} value
       * @param {Object} options
       * @param {Object=} options.context
       * @param {Object=} options.parent
       */


      cast(value, options) {
        return this.getValue(value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context);
      }

      resolve() {
        return this;
      }

      describe() {
        return {
          type: 'ref',
          key: this.key
        };
      }

      toString() {
        return `Ref(${this.key})`;
      }

      static isRef(value) {
        return value && value.__isYupRef;
      }

    } // @ts-ignore

    Reference.prototype.__isYupRef = true;

    function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

    function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
    function createValidation(config) {
      function validate(_ref, cb) {
        let {
          value,
          path = '',
          label,
          options,
          originalValue,
          sync
        } = _ref,
            rest = _objectWithoutPropertiesLoose(_ref, ["value", "path", "label", "options", "originalValue", "sync"]);

        const {
          name,
          test,
          params,
          message
        } = config;
        let {
          parent,
          context
        } = options;

        function resolve(item) {
          return Reference.isRef(item) ? item.getValue(value, parent, context) : item;
        }

        function createError(overrides = {}) {
          const nextParams = mapValues_1(_extends$3({
            value,
            originalValue,
            label,
            path: overrides.path || path
          }, params, overrides.params), resolve);
          const error = new ValidationError(ValidationError.formatError(overrides.message || message, nextParams), value, nextParams.path, overrides.type || name);
          error.params = nextParams;
          return error;
        }

        let ctx = _extends$3({
          path,
          parent,
          type: name,
          createError,
          resolve,
          options,
          originalValue
        }, rest);

        if (!sync) {
          try {
            Promise.resolve(test.call(ctx, value, ctx)).then(validOrError => {
              if (ValidationError.isError(validOrError)) cb(validOrError);else if (!validOrError) cb(createError());else cb(null, validOrError);
            }).catch(cb);
          } catch (err) {
            cb(err);
          }

          return;
        }

        let result;

        try {
          var _ref2;

          result = test.call(ctx, value, ctx);

          if (typeof ((_ref2 = result) == null ? void 0 : _ref2.then) === 'function') {
            throw new Error(`Validation test of type: "${ctx.type}" returned a Promise during a synchronous validate. ` + `This test will finish after the validate call has returned`);
          }
        } catch (err) {
          cb(err);
          return;
        }

        if (ValidationError.isError(result)) cb(result);else if (!result) cb(createError());else cb(null, result);
      }

      validate.OPTIONS = config;
      return validate;
    }

    let trim = part => part.substr(0, part.length - 1).substr(1);

    function getIn(schema, path, value, context = value) {
      let parent, lastPart, lastPartDebug; // root path: ''

      if (!path) return {
        parent,
        parentPath: path,
        schema
      };
      propertyExpr.forEach(path, (_part, isBracket, isArray) => {
        let part = isBracket ? trim(_part) : _part;
        schema = schema.resolve({
          context,
          parent,
          value
        });

        if (schema.innerType) {
          let idx = isArray ? parseInt(part, 10) : 0;

          if (value && idx >= value.length) {
            throw new Error(`Yup.reach cannot resolve an array item at index: ${_part}, in the path: ${path}. ` + `because there is no value at that index. `);
          }

          parent = value;
          value = value && value[idx];
          schema = schema.innerType;
        } // sometimes the array index part of a path doesn't exist: "nested.arr.child"
        // in these cases the current part is the next schema and should be processed
        // in this iteration. For cases where the index signature is included this
        // check will fail and we'll handle the `child` part on the next iteration like normal


        if (!isArray) {
          if (!schema.fields || !schema.fields[part]) throw new Error(`The schema does not contain the path: ${path}. ` + `(failed at: ${lastPartDebug} which is a type: "${schema._type}")`);
          parent = value;
          value = value && value[part];
          schema = schema.fields[part];
        }

        lastPart = part;
        lastPartDebug = isBracket ? '[' + _part + ']' : '.' + _part;
      });
      return {
        schema,
        parent,
        parentPath: lastPart
      };
    }

    const reach = (obj, path, value, context) => getIn(obj, path, value, context).schema;

    class ReferenceSet {
      constructor() {
        this.list = void 0;
        this.refs = void 0;
        this.list = new Set();
        this.refs = new Map();
      }

      get size() {
        return this.list.size + this.refs.size;
      }

      describe() {
        const description = [];

        for (const item of this.list) description.push(item);

        for (const [, ref] of this.refs) description.push(ref.describe());

        return description;
      }

      toArray() {
        return Array.from(this.list).concat(Array.from(this.refs.values()));
      }

      resolveAll(resolve) {
        return this.toArray().reduce((acc, e) => acc.concat(Reference.isRef(e) ? resolve(e) : e), []);
      }

      add(value) {
        Reference.isRef(value) ? this.refs.set(value.key, value) : this.list.add(value);
      }

      delete(value) {
        Reference.isRef(value) ? this.refs.delete(value.key) : this.list.delete(value);
      }

      clone() {
        const next = new ReferenceSet();
        next.list = new Set(this.list);
        next.refs = new Map(this.refs);
        return next;
      }

      merge(newItems, removeItems) {
        const next = this.clone();
        newItems.list.forEach(value => next.add(value));
        newItems.refs.forEach(value => next.add(value));
        removeItems.list.forEach(value => next.delete(value));
        removeItems.refs.forEach(value => next.delete(value));
        return next;
      }

    }

    function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

    class BaseSchema {
      constructor(options) {
        this.deps = [];
        this.tests = void 0;
        this.transforms = void 0;
        this.conditions = [];
        this._mutate = void 0;
        this._typeError = void 0;
        this._whitelist = new ReferenceSet();
        this._blacklist = new ReferenceSet();
        this.exclusiveTests = Object.create(null);
        this.spec = void 0;
        this.tests = [];
        this.transforms = [];
        this.withMutation(() => {
          this.typeError(mixed.notType);
        });
        this.type = (options == null ? void 0 : options.type) || 'mixed';
        this.spec = _extends$2({
          strip: false,
          strict: false,
          abortEarly: true,
          recursive: true,
          nullable: false,
          presence: 'optional'
        }, options == null ? void 0 : options.spec);
      } // TODO: remove


      get _type() {
        return this.type;
      }

      _typeCheck(_value) {
        return true;
      }

      clone(spec) {
        if (this._mutate) {
          if (spec) Object.assign(this.spec, spec);
          return this;
        } // if the nested value is a schema we can skip cloning, since
        // they are already immutable


        const next = Object.create(Object.getPrototypeOf(this)); // @ts-expect-error this is readonly

        next.type = this.type;
        next._typeError = this._typeError;
        next._whitelistError = this._whitelistError;
        next._blacklistError = this._blacklistError;
        next._whitelist = this._whitelist.clone();
        next._blacklist = this._blacklist.clone();
        next.exclusiveTests = _extends$2({}, this.exclusiveTests); // @ts-expect-error this is readonly

        next.deps = [...this.deps];
        next.conditions = [...this.conditions];
        next.tests = [...this.tests];
        next.transforms = [...this.transforms];
        next.spec = clone(_extends$2({}, this.spec, spec));
        return next;
      }

      label(label) {
        let next = this.clone();
        next.spec.label = label;
        return next;
      }

      meta(...args) {
        if (args.length === 0) return this.spec.meta;
        let next = this.clone();
        next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
        return next;
      } // withContext<TContext extends AnyObject>(): BaseSchema<
      //   TCast,
      //   TContext,
      //   TOutput
      // > {
      //   return this as any;
      // }


      withMutation(fn) {
        let before = this._mutate;
        this._mutate = true;
        let result = fn(this);
        this._mutate = before;
        return result;
      }

      concat(schema) {
        if (!schema || schema === this) return this;
        if (schema.type !== this.type && this.type !== 'mixed') throw new TypeError(`You cannot \`concat()\` schema's of different types: ${this.type} and ${schema.type}`);
        let base = this;
        let combined = schema.clone();

        const mergedSpec = _extends$2({}, base.spec, combined.spec); // if (combined.spec.nullable === UNSET)
        //   mergedSpec.nullable = base.spec.nullable;
        // if (combined.spec.presence === UNSET)
        //   mergedSpec.presence = base.spec.presence;


        combined.spec = mergedSpec;
        combined._typeError || (combined._typeError = base._typeError);
        combined._whitelistError || (combined._whitelistError = base._whitelistError);
        combined._blacklistError || (combined._blacklistError = base._blacklistError); // manually merge the blacklist/whitelist (the other `schema` takes
        // precedence in case of conflicts)

        combined._whitelist = base._whitelist.merge(schema._whitelist, schema._blacklist);
        combined._blacklist = base._blacklist.merge(schema._blacklist, schema._whitelist); // start with the current tests

        combined.tests = base.tests;
        combined.exclusiveTests = base.exclusiveTests; // manually add the new tests to ensure
        // the deduping logic is consistent

        combined.withMutation(next => {
          schema.tests.forEach(fn => {
            next.test(fn.OPTIONS);
          });
        });
        combined.transforms = [...base.transforms, ...combined.transforms];
        return combined;
      }

      isType(v) {
        if (this.spec.nullable && v === null) return true;
        return this._typeCheck(v);
      }

      resolve(options) {
        let schema = this;

        if (schema.conditions.length) {
          let conditions = schema.conditions;
          schema = schema.clone();
          schema.conditions = [];
          schema = conditions.reduce((schema, condition) => condition.resolve(schema, options), schema);
          schema = schema.resolve(options);
        }

        return schema;
      }
      /**
       *
       * @param {*} value
       * @param {Object} options
       * @param {*=} options.parent
       * @param {*=} options.context
       */


      cast(value, options = {}) {
        let resolvedSchema = this.resolve(_extends$2({
          value
        }, options));

        let result = resolvedSchema._cast(value, options);

        if (value !== undefined && options.assert !== false && resolvedSchema.isType(result) !== true) {
          let formattedValue = printValue(value);
          let formattedResult = printValue(result);
          throw new TypeError(`The value of ${options.path || 'field'} could not be cast to a value ` + `that satisfies the schema type: "${resolvedSchema._type}". \n\n` + `attempted value: ${formattedValue} \n` + (formattedResult !== formattedValue ? `result of cast: ${formattedResult}` : ''));
        }

        return result;
      }

      _cast(rawValue, _options) {
        let value = rawValue === undefined ? rawValue : this.transforms.reduce((value, fn) => fn.call(this, value, rawValue, this), rawValue);

        if (value === undefined) {
          value = this.getDefault();
        }

        return value;
      }

      _validate(_value, options = {}, cb) {
        let {
          sync,
          path,
          from = [],
          originalValue = _value,
          strict = this.spec.strict,
          abortEarly = this.spec.abortEarly
        } = options;
        let value = _value;

        if (!strict) {
          // this._validating = true;
          value = this._cast(value, _extends$2({
            assert: false
          }, options)); // this._validating = false;
        } // value is cast, we can check if it meets type requirements


        let args = {
          value,
          path,
          options,
          originalValue,
          schema: this,
          label: this.spec.label,
          sync,
          from
        };
        let initialTests = [];
        if (this._typeError) initialTests.push(this._typeError);
        let finalTests = [];
        if (this._whitelistError) finalTests.push(this._whitelistError);
        if (this._blacklistError) finalTests.push(this._blacklistError);
        runTests({
          args,
          value,
          path,
          sync,
          tests: initialTests,
          endEarly: abortEarly
        }, err => {
          if (err) return void cb(err, value);
          runTests({
            tests: this.tests.concat(finalTests),
            args,
            path,
            sync,
            value,
            endEarly: abortEarly
          }, cb);
        });
      }

      validate(value, options, maybeCb) {
        let schema = this.resolve(_extends$2({}, options, {
          value
        })); // callback case is for nested validations

        return typeof maybeCb === 'function' ? schema._validate(value, options, maybeCb) : new Promise((resolve, reject) => schema._validate(value, options, (err, value) => {
          if (err) reject(err);else resolve(value);
        }));
      }

      validateSync(value, options) {
        let schema = this.resolve(_extends$2({}, options, {
          value
        }));
        let result;

        schema._validate(value, _extends$2({}, options, {
          sync: true
        }), (err, value) => {
          if (err) throw err;
          result = value;
        });

        return result;
      }

      isValid(value, options) {
        return this.validate(value, options).then(() => true, err => {
          if (ValidationError.isError(err)) return false;
          throw err;
        });
      }

      isValidSync(value, options) {
        try {
          this.validateSync(value, options);
          return true;
        } catch (err) {
          if (ValidationError.isError(err)) return false;
          throw err;
        }
      }

      _getDefault() {
        let defaultValue = this.spec.default;

        if (defaultValue == null) {
          return defaultValue;
        }

        return typeof defaultValue === 'function' ? defaultValue.call(this) : clone(defaultValue);
      }

      getDefault(options) {
        let schema = this.resolve(options || {});
        return schema._getDefault();
      }

      default(def) {
        if (arguments.length === 0) {
          return this._getDefault();
        }

        let next = this.clone({
          default: def
        });
        return next;
      }

      strict(isStrict = true) {
        let next = this.clone();
        next.spec.strict = isStrict;
        return next;
      }

      _isPresent(value) {
        return value != null;
      }

      defined(message = mixed.defined) {
        return this.test({
          message,
          name: 'defined',
          exclusive: true,

          test(value) {
            return value !== undefined;
          }

        });
      }

      required(message = mixed.required) {
        return this.clone({
          presence: 'required'
        }).withMutation(s => s.test({
          message,
          name: 'required',
          exclusive: true,

          test(value) {
            return this.schema._isPresent(value);
          }

        }));
      }

      notRequired() {
        let next = this.clone({
          presence: 'optional'
        });
        next.tests = next.tests.filter(test => test.OPTIONS.name !== 'required');
        return next;
      }

      nullable(isNullable = true) {
        let next = this.clone({
          nullable: isNullable !== false
        });
        return next;
      }

      transform(fn) {
        let next = this.clone();
        next.transforms.push(fn);
        return next;
      }
      /**
       * Adds a test function to the schema's queue of tests.
       * tests can be exclusive or non-exclusive.
       *
       * - exclusive tests, will replace any existing tests of the same name.
       * - non-exclusive: can be stacked
       *
       * If a non-exclusive test is added to a schema with an exclusive test of the same name
       * the exclusive test is removed and further tests of the same name will be stacked.
       *
       * If an exclusive test is added to a schema with non-exclusive tests of the same name
       * the previous tests are removed and further tests of the same name will replace each other.
       */


      test(...args) {
        let opts;

        if (args.length === 1) {
          if (typeof args[0] === 'function') {
            opts = {
              test: args[0]
            };
          } else {
            opts = args[0];
          }
        } else if (args.length === 2) {
          opts = {
            name: args[0],
            test: args[1]
          };
        } else {
          opts = {
            name: args[0],
            message: args[1],
            test: args[2]
          };
        }

        if (opts.message === undefined) opts.message = mixed.default;
        if (typeof opts.test !== 'function') throw new TypeError('`test` is a required parameters');
        let next = this.clone();
        let validate = createValidation(opts);
        let isExclusive = opts.exclusive || opts.name && next.exclusiveTests[opts.name] === true;

        if (opts.exclusive) {
          if (!opts.name) throw new TypeError('Exclusive tests must provide a unique `name` identifying the test');
        }

        if (opts.name) next.exclusiveTests[opts.name] = !!opts.exclusive;
        next.tests = next.tests.filter(fn => {
          if (fn.OPTIONS.name === opts.name) {
            if (isExclusive) return false;
            if (fn.OPTIONS.test === validate.OPTIONS.test) return false;
          }

          return true;
        });
        next.tests.push(validate);
        return next;
      }

      when(keys, options) {
        if (!Array.isArray(keys) && typeof keys !== 'string') {
          options = keys;
          keys = '.';
        }

        let next = this.clone();
        let deps = toArray(keys).map(key => new Reference(key));
        deps.forEach(dep => {
          // @ts-ignore
          if (dep.isSibling) next.deps.push(dep.key);
        });
        next.conditions.push(new Condition(deps, options));
        return next;
      }

      typeError(message) {
        let next = this.clone();
        next._typeError = createValidation({
          message,
          name: 'typeError',

          test(value) {
            if (value !== undefined && !this.schema.isType(value)) return this.createError({
              params: {
                type: this.schema._type
              }
            });
            return true;
          }

        });
        return next;
      }

      oneOf(enums, message = mixed.oneOf) {
        let next = this.clone();
        enums.forEach(val => {
          next._whitelist.add(val);

          next._blacklist.delete(val);
        });
        next._whitelistError = createValidation({
          message,
          name: 'oneOf',

          test(value) {
            if (value === undefined) return true;
            let valids = this.schema._whitelist;
            let resolved = valids.resolveAll(this.resolve);
            return resolved.includes(value) ? true : this.createError({
              params: {
                values: valids.toArray().join(', '),
                resolved
              }
            });
          }

        });
        return next;
      }

      notOneOf(enums, message = mixed.notOneOf) {
        let next = this.clone();
        enums.forEach(val => {
          next._blacklist.add(val);

          next._whitelist.delete(val);
        });
        next._blacklistError = createValidation({
          message,
          name: 'notOneOf',

          test(value) {
            let invalids = this.schema._blacklist;
            let resolved = invalids.resolveAll(this.resolve);
            if (resolved.includes(value)) return this.createError({
              params: {
                values: invalids.toArray().join(', '),
                resolved
              }
            });
            return true;
          }

        });
        return next;
      }

      strip(strip = true) {
        let next = this.clone();
        next.spec.strip = strip;
        return next;
      }

      describe() {
        const next = this.clone();
        const {
          label,
          meta
        } = next.spec;
        const description = {
          meta,
          label,
          type: next.type,
          oneOf: next._whitelist.describe(),
          notOneOf: next._blacklist.describe(),
          tests: next.tests.map(fn => ({
            name: fn.OPTIONS.name,
            params: fn.OPTIONS.params
          })).filter((n, idx, list) => list.findIndex(c => c.name === n.name) === idx)
        };
        return description;
      }

    } // eslint-disable-next-line @typescript-eslint/no-unused-vars

    // @ts-expect-error
    BaseSchema.prototype.__isYupSchema__ = true;

    for (const method of ['validate', 'validateSync']) BaseSchema.prototype[`${method}At`] = function (path, value, options = {}) {
      const {
        parent,
        parentPath,
        schema
      } = getIn(this, path, value, options.context);
      return schema[method](parent && parent[parentPath], _extends$2({}, options, {
        parent,
        path
      }));
    };

    for (const alias of ['equals', 'is']) BaseSchema.prototype[alias] = BaseSchema.prototype.oneOf;

    for (const alias of ['not', 'nope']) BaseSchema.prototype[alias] = BaseSchema.prototype.notOneOf;

    BaseSchema.prototype.optional = BaseSchema.prototype.notRequired;

    const Mixed = BaseSchema;
    function create$7() {
      return new Mixed();
    } // XXX: this is using the Base schema so that `addMethod(mixed)` works as a base class

    create$7.prototype = Mixed.prototype;

    const isAbsent = value => value == null;

    function create$6() {
      return new BooleanSchema();
    }
    class BooleanSchema extends BaseSchema {
      constructor() {
        super({
          type: 'boolean'
        });
        this.withMutation(() => {
          this.transform(function (value) {
            if (!this.isType(value)) {
              if (/^(true|1)$/i.test(String(value))) return true;
              if (/^(false|0)$/i.test(String(value))) return false;
            }

            return value;
          });
        });
      }

      _typeCheck(v) {
        if (v instanceof Boolean) v = v.valueOf();
        return typeof v === 'boolean';
      }

      isTrue(message = boolean.isValue) {
        return this.test({
          message,
          name: 'is-value',
          exclusive: true,
          params: {
            value: 'true'
          },

          test(value) {
            return isAbsent(value) || value === true;
          }

        });
      }

      isFalse(message = boolean.isValue) {
        return this.test({
          message,
          name: 'is-value',
          exclusive: true,
          params: {
            value: 'false'
          },

          test(value) {
            return isAbsent(value) || value === false;
          }

        });
      }

    }
    create$6.prototype = BooleanSchema.prototype;

    let rEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-next-line

    let rUrl = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i; // eslint-disable-next-line

    let rUUID = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    let isTrimmed = value => isAbsent(value) || value === value.trim();

    let objStringTag = {}.toString();
    function create$5() {
      return new StringSchema();
    }
    class StringSchema extends BaseSchema {
      constructor() {
        super({
          type: 'string'
        });
        this.withMutation(() => {
          this.transform(function (value) {
            if (this.isType(value)) return value;
            if (Array.isArray(value)) return value;
            const strValue = value != null && value.toString ? value.toString() : value;
            if (strValue === objStringTag) return value;
            return strValue;
          });
        });
      }

      _typeCheck(value) {
        if (value instanceof String) value = value.valueOf();
        return typeof value === 'string';
      }

      _isPresent(value) {
        return super._isPresent(value) && !!value.length;
      }

      length(length, message = string.length) {
        return this.test({
          message,
          name: 'length',
          exclusive: true,
          params: {
            length
          },

          test(value) {
            return isAbsent(value) || value.length === this.resolve(length);
          }

        });
      }

      min(min, message = string.min) {
        return this.test({
          message,
          name: 'min',
          exclusive: true,
          params: {
            min
          },

          test(value) {
            return isAbsent(value) || value.length >= this.resolve(min);
          }

        });
      }

      max(max, message = string.max) {
        return this.test({
          name: 'max',
          exclusive: true,
          message,
          params: {
            max
          },

          test(value) {
            return isAbsent(value) || value.length <= this.resolve(max);
          }

        });
      }

      matches(regex, options) {
        let excludeEmptyString = false;
        let message;
        let name;

        if (options) {
          if (typeof options === 'object') {
            ({
              excludeEmptyString = false,
              message,
              name
            } = options);
          } else {
            message = options;
          }
        }

        return this.test({
          name: name || 'matches',
          message: message || string.matches,
          params: {
            regex
          },
          test: value => isAbsent(value) || value === '' && excludeEmptyString || value.search(regex) !== -1
        });
      }

      email(message = string.email) {
        return this.matches(rEmail, {
          name: 'email',
          message,
          excludeEmptyString: true
        });
      }

      url(message = string.url) {
        return this.matches(rUrl, {
          name: 'url',
          message,
          excludeEmptyString: true
        });
      }

      uuid(message = string.uuid) {
        return this.matches(rUUID, {
          name: 'uuid',
          message,
          excludeEmptyString: false
        });
      } //-- transforms --


      ensure() {
        return this.default('').transform(val => val === null ? '' : val);
      }

      trim(message = string.trim) {
        return this.transform(val => val != null ? val.trim() : val).test({
          message,
          name: 'trim',
          test: isTrimmed
        });
      }

      lowercase(message = string.lowercase) {
        return this.transform(value => !isAbsent(value) ? value.toLowerCase() : value).test({
          message,
          name: 'string_case',
          exclusive: true,
          test: value => isAbsent(value) || value === value.toLowerCase()
        });
      }

      uppercase(message = string.uppercase) {
        return this.transform(value => !isAbsent(value) ? value.toUpperCase() : value).test({
          message,
          name: 'string_case',
          exclusive: true,
          test: value => isAbsent(value) || value === value.toUpperCase()
        });
      }

    }
    create$5.prototype = StringSchema.prototype; //
    // String Interfaces
    //

    let isNaN$1 = value => value != +value;

    function create$4() {
      return new NumberSchema();
    }
    class NumberSchema extends BaseSchema {
      constructor() {
        super({
          type: 'number'
        });
        this.withMutation(() => {
          this.transform(function (value) {
            let parsed = value;

            if (typeof parsed === 'string') {
              parsed = parsed.replace(/\s/g, '');
              if (parsed === '') return NaN; // don't use parseFloat to avoid positives on alpha-numeric strings

              parsed = +parsed;
            }

            if (this.isType(parsed)) return parsed;
            return parseFloat(parsed);
          });
        });
      }

      _typeCheck(value) {
        if (value instanceof Number) value = value.valueOf();
        return typeof value === 'number' && !isNaN$1(value);
      }

      min(min, message = number.min) {
        return this.test({
          message,
          name: 'min',
          exclusive: true,
          params: {
            min
          },

          test(value) {
            return isAbsent(value) || value >= this.resolve(min);
          }

        });
      }

      max(max, message = number.max) {
        return this.test({
          message,
          name: 'max',
          exclusive: true,
          params: {
            max
          },

          test(value) {
            return isAbsent(value) || value <= this.resolve(max);
          }

        });
      }

      lessThan(less, message = number.lessThan) {
        return this.test({
          message,
          name: 'max',
          exclusive: true,
          params: {
            less
          },

          test(value) {
            return isAbsent(value) || value < this.resolve(less);
          }

        });
      }

      moreThan(more, message = number.moreThan) {
        return this.test({
          message,
          name: 'min',
          exclusive: true,
          params: {
            more
          },

          test(value) {
            return isAbsent(value) || value > this.resolve(more);
          }

        });
      }

      positive(msg = number.positive) {
        return this.moreThan(0, msg);
      }

      negative(msg = number.negative) {
        return this.lessThan(0, msg);
      }

      integer(message = number.integer) {
        return this.test({
          name: 'integer',
          message,
          test: val => isAbsent(val) || Number.isInteger(val)
        });
      }

      truncate() {
        return this.transform(value => !isAbsent(value) ? value | 0 : value);
      }

      round(method) {
        var _method;

        let avail = ['ceil', 'floor', 'round', 'trunc'];
        method = ((_method = method) == null ? void 0 : _method.toLowerCase()) || 'round'; // this exists for symemtry with the new Math.trunc

        if (method === 'trunc') return this.truncate();
        if (avail.indexOf(method.toLowerCase()) === -1) throw new TypeError('Only valid options for round() are: ' + avail.join(', '));
        return this.transform(value => !isAbsent(value) ? Math[method](value) : value);
      }

    }
    create$4.prototype = NumberSchema.prototype; //
    // Number Interfaces
    //

    /* eslint-disable */

    /**
     *
     * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
     * NON-CONFORMANT EDITION.
     * © 2011 Colin Snover <http://zetafleet.com>
     * Released under MIT license.
     */
    //              1 YYYY                 2 MM        3 DD              4 HH     5 mm        6 ss            7 msec         8 Z 9 ±    10 tzHH    11 tzmm
    var isoReg = /^(\d{4}|[+\-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;
    function parseIsoDate(date) {
      var numericKeys = [1, 4, 5, 6, 7, 10, 11],
          minutesOffset = 0,
          timestamp,
          struct;

      if (struct = isoReg.exec(date)) {
        // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
        for (var i = 0, k; k = numericKeys[i]; ++i) struct[k] = +struct[k] || 0; // allow undefined days and months


        struct[2] = (+struct[2] || 1) - 1;
        struct[3] = +struct[3] || 1; // allow arbitrary sub-second precision beyond milliseconds

        struct[7] = struct[7] ? String(struct[7]).substr(0, 3) : 0; // timestamps without timezone identifiers should be considered local time

        if ((struct[8] === undefined || struct[8] === '') && (struct[9] === undefined || struct[9] === '')) timestamp = +new Date(struct[1], struct[2], struct[3], struct[4], struct[5], struct[6], struct[7]);else {
          if (struct[8] !== 'Z' && struct[9] !== undefined) {
            minutesOffset = struct[10] * 60 + struct[11];
            if (struct[9] === '+') minutesOffset = 0 - minutesOffset;
          }

          timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
        }
      } else timestamp = Date.parse ? Date.parse(date) : NaN;

      return timestamp;
    }

    // @ts-ignore
    let invalidDate = new Date('');

    let isDate = obj => Object.prototype.toString.call(obj) === '[object Date]';

    function create$3() {
      return new DateSchema();
    }
    class DateSchema extends BaseSchema {
      constructor() {
        super({
          type: 'date'
        });
        this.withMutation(() => {
          this.transform(function (value) {
            if (this.isType(value)) return value;
            value = parseIsoDate(value); // 0 is a valid timestamp equivalent to 1970-01-01T00:00:00Z(unix epoch) or before.

            return !isNaN(value) ? new Date(value) : invalidDate;
          });
        });
      }

      _typeCheck(v) {
        return isDate(v) && !isNaN(v.getTime());
      }

      prepareParam(ref, name) {
        let param;

        if (!Reference.isRef(ref)) {
          let cast = this.cast(ref);
          if (!this._typeCheck(cast)) throw new TypeError(`\`${name}\` must be a Date or a value that can be \`cast()\` to a Date`);
          param = cast;
        } else {
          param = ref;
        }

        return param;
      }

      min(min, message = date.min) {
        let limit = this.prepareParam(min, 'min');
        return this.test({
          message,
          name: 'min',
          exclusive: true,
          params: {
            min
          },

          test(value) {
            return isAbsent(value) || value >= this.resolve(limit);
          }

        });
      }

      max(max, message = date.max) {
        let limit = this.prepareParam(max, 'max');
        return this.test({
          message,
          name: 'max',
          exclusive: true,
          params: {
            max
          },

          test(value) {
            return isAbsent(value) || value <= this.resolve(limit);
          }

        });
      }

    }
    DateSchema.INVALID_DATE = invalidDate;
    create$3.prototype = DateSchema.prototype;
    create$3.INVALID_DATE = invalidDate;

    /**
     * A specialized version of `_.reduce` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initAccum] Specify using the first element of `array` as
     *  the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1,
          length = array == null ? 0 : array.length;

      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    var _arrayReduce = arrayReduce;

    /**
     * The base implementation of `_.propertyOf` without support for deep paths.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? undefined : object[key];
      };
    }

    var _basePropertyOf = basePropertyOf;

    /** Used to map Latin Unicode letters to basic Latin letters. */
    var deburredLetters = {
      // Latin-1 Supplement block.
      '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
      '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
      '\xc7': 'C',  '\xe7': 'c',
      '\xd0': 'D',  '\xf0': 'd',
      '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
      '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
      '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
      '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
      '\xd1': 'N',  '\xf1': 'n',
      '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
      '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
      '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
      '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
      '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
      '\xc6': 'Ae', '\xe6': 'ae',
      '\xde': 'Th', '\xfe': 'th',
      '\xdf': 'ss',
      // Latin Extended-A block.
      '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
      '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
      '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
      '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
      '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
      '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
      '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
      '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
      '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
      '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
      '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
      '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
      '\u0134': 'J',  '\u0135': 'j',
      '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
      '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
      '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
      '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
      '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
      '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
      '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
      '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
      '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
      '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
      '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
      '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
      '\u0163': 't',  '\u0165': 't', '\u0167': 't',
      '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
      '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
      '\u0174': 'W',  '\u0175': 'w',
      '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
      '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
      '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
      '\u0132': 'IJ', '\u0133': 'ij',
      '\u0152': 'Oe', '\u0153': 'oe',
      '\u0149': "'n", '\u017f': 's'
    };

    /**
     * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
     * letters to basic Latin letters.
     *
     * @private
     * @param {string} letter The matched letter to deburr.
     * @returns {string} Returns the deburred letter.
     */
    var deburrLetter = _basePropertyOf(deburredLetters);

    var _deburrLetter = deburrLetter;

    /** Used to match Latin Unicode letters (excluding mathematical operators). */
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

    /** Used to compose unicode character classes. */
    var rsComboMarksRange$3 = '\\u0300-\\u036f',
        reComboHalfMarksRange$3 = '\\ufe20-\\ufe2f',
        rsComboSymbolsRange$3 = '\\u20d0-\\u20ff',
        rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3;

    /** Used to compose unicode capture groups. */
    var rsCombo$2 = '[' + rsComboRange$3 + ']';

    /**
     * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
     * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
     */
    var reComboMark = RegExp(rsCombo$2, 'g');

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString_1(string);
      return string && string.replace(reLatin, _deburrLetter).replace(reComboMark, '');
    }

    var deburr_1 = deburr;

    /** Used to match words composed of alphanumeric characters. */
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

    /**
     * Splits an ASCII `string` into an array of its words.
     *
     * @private
     * @param {string} The string to inspect.
     * @returns {Array} Returns the words of `string`.
     */
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }

    var _asciiWords = asciiWords;

    /** Used to detect strings that need a more robust regexp to match words. */
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

    /**
     * Checks if `string` contains a word composed of Unicode symbols.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {boolean} Returns `true` if a word is found, else `false`.
     */
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }

    var _hasUnicodeWord = hasUnicodeWord;

    /** Used to compose unicode character classes. */
    var rsAstralRange$2 = '\\ud800-\\udfff',
        rsComboMarksRange$2 = '\\u0300-\\u036f',
        reComboHalfMarksRange$2 = '\\ufe20-\\ufe2f',
        rsComboSymbolsRange$2 = '\\u20d0-\\u20ff',
        rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2,
        rsDingbatRange = '\\u2700-\\u27bf',
        rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
        rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
        rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
        rsPunctuationRange = '\\u2000-\\u206f',
        rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
        rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
        rsVarRange$2 = '\\ufe0e\\ufe0f',
        rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

    /** Used to compose unicode capture groups. */
    var rsApos$1 = "['\u2019]",
        rsBreak = '[' + rsBreakRange + ']',
        rsCombo$1 = '[' + rsComboRange$2 + ']',
        rsDigits = '\\d+',
        rsDingbat = '[' + rsDingbatRange + ']',
        rsLower = '[' + rsLowerRange + ']',
        rsMisc = '[^' + rsAstralRange$2 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
        rsFitz$1 = '\\ud83c[\\udffb-\\udfff]',
        rsModifier$1 = '(?:' + rsCombo$1 + '|' + rsFitz$1 + ')',
        rsNonAstral$1 = '[^' + rsAstralRange$2 + ']',
        rsRegional$1 = '(?:\\ud83c[\\udde6-\\uddff]){2}',
        rsSurrPair$1 = '[\\ud800-\\udbff][\\udc00-\\udfff]',
        rsUpper = '[' + rsUpperRange + ']',
        rsZWJ$2 = '\\u200d';

    /** Used to compose unicode regexes. */
    var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
        rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
        rsOptContrLower = '(?:' + rsApos$1 + '(?:d|ll|m|re|s|t|ve))?',
        rsOptContrUpper = '(?:' + rsApos$1 + '(?:D|LL|M|RE|S|T|VE))?',
        reOptMod$1 = rsModifier$1 + '?',
        rsOptVar$1 = '[' + rsVarRange$2 + ']?',
        rsOptJoin$1 = '(?:' + rsZWJ$2 + '(?:' + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsOptVar$1 + reOptMod$1 + ')*',
        rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
        rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
        rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1,
        rsEmoji = '(?:' + [rsDingbat, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsSeq$1;

    /** Used to match complex or compound words. */
    var reUnicodeWord = RegExp([
      rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
      rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
      rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
      rsUpper + '+' + rsOptContrUpper,
      rsOrdUpper,
      rsOrdLower,
      rsDigits,
      rsEmoji
    ].join('|'), 'g');

    /**
     * Splits a Unicode `string` into an array of its words.
     *
     * @private
     * @param {string} The string to inspect.
     * @returns {Array} Returns the words of `string`.
     */
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }

    var _unicodeWords = unicodeWords;

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString_1(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return _hasUnicodeWord(string) ? _unicodeWords(string) : _asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    var words_1 = words;

    /** Used to compose unicode capture groups. */
    var rsApos = "['\u2019]";

    /** Used to match apostrophes. */
    var reApos = RegExp(rsApos, 'g');

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return _arrayReduce(words_1(deburr_1(string).replace(reApos, '')), callback, '');
      };
    }

    var _createCompounder = createCompounder;

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = _createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    var snakeCase_1 = snakeCase;

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    var _baseSlice = baseSlice;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : _baseSlice(array, start, end);
    }

    var _castSlice = castSlice;

    /** Used to compose unicode character classes. */
    var rsAstralRange$1 = '\\ud800-\\udfff',
        rsComboMarksRange$1 = '\\u0300-\\u036f',
        reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
        rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
        rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
        rsVarRange$1 = '\\ufe0e\\ufe0f';

    /** Used to compose unicode capture groups. */
    var rsZWJ$1 = '\\u200d';

    /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
    var reHasUnicode = RegExp('[' + rsZWJ$1 + rsAstralRange$1  + rsComboRange$1 + rsVarRange$1 + ']');

    /**
     * Checks if `string` contains Unicode symbols.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {boolean} Returns `true` if a symbol is found, else `false`.
     */
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }

    var _hasUnicode = hasUnicode;

    /**
     * Converts an ASCII `string` to an array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the converted array.
     */
    function asciiToArray(string) {
      return string.split('');
    }

    var _asciiToArray = asciiToArray;

    /** Used to compose unicode character classes. */
    var rsAstralRange = '\\ud800-\\udfff',
        rsComboMarksRange = '\\u0300-\\u036f',
        reComboHalfMarksRange = '\\ufe20-\\ufe2f',
        rsComboSymbolsRange = '\\u20d0-\\u20ff',
        rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
        rsVarRange = '\\ufe0e\\ufe0f';

    /** Used to compose unicode capture groups. */
    var rsAstral = '[' + rsAstralRange + ']',
        rsCombo = '[' + rsComboRange + ']',
        rsFitz = '\\ud83c[\\udffb-\\udfff]',
        rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
        rsNonAstral = '[^' + rsAstralRange + ']',
        rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
        rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
        rsZWJ = '\\u200d';

    /** Used to compose unicode regexes. */
    var reOptMod = rsModifier + '?',
        rsOptVar = '[' + rsVarRange + ']?',
        rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
        rsSeq = rsOptVar + reOptMod + rsOptJoin,
        rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

    /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
    var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

    /**
     * Converts a Unicode `string` to an array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the converted array.
     */
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }

    var _unicodeToArray = unicodeToArray;

    /**
     * Converts `string` to an array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the converted array.
     */
    function stringToArray(string) {
      return _hasUnicode(string)
        ? _unicodeToArray(string)
        : _asciiToArray(string);
    }

    var _stringToArray = stringToArray;

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString_1(string);

        var strSymbols = _hasUnicode(string)
          ? _stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? _castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    var _createCaseFirst = createCaseFirst;

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = _createCaseFirst('toUpperCase');

    var upperFirst_1 = upperFirst;

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst_1(toString_1(string).toLowerCase());
    }

    var capitalize_1 = capitalize;

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = _createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize_1(word) : word);
    });

    var camelCase_1 = camelCase;

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = _baseIteratee(iteratee);

      _baseForOwn(object, function(value, key, object) {
        _baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    var mapKeys_1 = mapKeys;

    /**
     * Topological sorting function
     *
     * @param {Array} edges
     * @returns {Array}
     */

    var toposort_1 = function(edges) {
      return toposort(uniqueNodes(edges), edges)
    };

    var array = toposort;

    function toposort(nodes, edges) {
      var cursor = nodes.length
        , sorted = new Array(cursor)
        , visited = {}
        , i = cursor
        // Better data structures make algorithm much faster.
        , outgoingEdges = makeOutgoingEdges(edges)
        , nodesHash = makeNodesHash(nodes);

      // check for unknown nodes
      edges.forEach(function(edge) {
        if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
          throw new Error('Unknown node. There is an unknown node in the supplied edges.')
        }
      });

      while (i--) {
        if (!visited[i]) visit(nodes[i], i, new Set());
      }

      return sorted

      function visit(node, i, predecessors) {
        if(predecessors.has(node)) {
          var nodeRep;
          try {
            nodeRep = ", node was:" + JSON.stringify(node);
          } catch(e) {
            nodeRep = "";
          }
          throw new Error('Cyclic dependency' + nodeRep)
        }

        if (!nodesHash.has(node)) {
          throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: '+JSON.stringify(node))
        }

        if (visited[i]) return;
        visited[i] = true;

        var outgoing = outgoingEdges.get(node) || new Set();
        outgoing = Array.from(outgoing);

        if (i = outgoing.length) {
          predecessors.add(node);
          do {
            var child = outgoing[--i];
            visit(child, nodesHash.get(child), predecessors);
          } while (i)
          predecessors.delete(node);
        }

        sorted[--cursor] = node;
      }
    }

    function uniqueNodes(arr){
      var res = new Set();
      for (var i = 0, len = arr.length; i < len; i++) {
        var edge = arr[i];
        res.add(edge[0]);
        res.add(edge[1]);
      }
      return Array.from(res)
    }

    function makeOutgoingEdges(arr){
      var edges = new Map();
      for (var i = 0, len = arr.length; i < len; i++) {
        var edge = arr[i];
        if (!edges.has(edge[0])) edges.set(edge[0], new Set());
        if (!edges.has(edge[1])) edges.set(edge[1], new Set());
        edges.get(edge[0]).add(edge[1]);
      }
      return edges
    }

    function makeNodesHash(arr){
      var res = new Map();
      for (var i = 0, len = arr.length; i < len; i++) {
        res.set(arr[i], i);
      }
      return res
    }
    toposort_1.array = array;

    function sortFields(fields, excludedEdges = []) {
      let edges = [];
      let nodes = new Set();
      let excludes = new Set(excludedEdges.map(([a, b]) => `${a}-${b}`));

      function addNode(depPath, key) {
        let node = propertyExpr.split(depPath)[0];
        nodes.add(node);
        if (!excludes.has(`${key}-${node}`)) edges.push([key, node]);
      }

      for (const key in fields) if (has_1(fields, key)) {
        let value = fields[key];
        nodes.add(key);
        if (Reference.isRef(value) && value.isSibling) addNode(value.path, key);else if (isSchema(value) && 'deps' in value) value.deps.forEach(path => addNode(path, key));
      }

      return toposort_1.array(Array.from(nodes), edges).reverse();
    }

    function findIndex(arr, err) {
      let idx = Infinity;
      arr.some((key, ii) => {
        var _err$path;

        if (((_err$path = err.path) == null ? void 0 : _err$path.indexOf(key)) !== -1) {
          idx = ii;
          return true;
        }
      });
      return idx;
    }

    function sortByKeyOrder(keys) {
      return (a, b) => {
        return findIndex(keys, a) - findIndex(keys, b);
      };
    }

    function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

    let isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

    function unknown(ctx, value) {
      let known = Object.keys(ctx.fields);
      return Object.keys(value).filter(key => known.indexOf(key) === -1);
    }

    const defaultSort = sortByKeyOrder([]);
    class ObjectSchema extends BaseSchema {
      constructor(spec) {
        super({
          type: 'object'
        });
        this.fields = Object.create(null);
        this._sortErrors = defaultSort;
        this._nodes = [];
        this._excludedEdges = [];
        this.withMutation(() => {
          this.transform(function coerce(value) {
            if (typeof value === 'string') {
              try {
                value = JSON.parse(value);
              } catch (err) {
                value = null;
              }
            }

            if (this.isType(value)) return value;
            return null;
          });

          if (spec) {
            this.shape(spec);
          }
        });
      }

      _typeCheck(value) {
        return isObject(value) || typeof value === 'function';
      }

      _cast(_value, options = {}) {
        var _options$stripUnknown;

        let value = super._cast(_value, options); //should ignore nulls here


        if (value === undefined) return this.getDefault();
        if (!this._typeCheck(value)) return value;
        let fields = this.fields;
        let strip = (_options$stripUnknown = options.stripUnknown) != null ? _options$stripUnknown : this.spec.noUnknown;

        let props = this._nodes.concat(Object.keys(value).filter(v => this._nodes.indexOf(v) === -1));

        let intermediateValue = {}; // is filled during the transform below

        let innerOptions = _extends$1({}, options, {
          parent: intermediateValue,
          __validating: options.__validating || false
        });

        let isChanged = false;

        for (const prop of props) {
          let field = fields[prop];
          let exists = has_1(value, prop);

          if (field) {
            let fieldValue;
            let inputValue = value[prop]; // safe to mutate since this is fired in sequence

            innerOptions.path = (options.path ? `${options.path}.` : '') + prop; // innerOptions.value = value[prop];

            field = field.resolve({
              value: inputValue,
              context: options.context,
              parent: intermediateValue
            });
            let fieldSpec = 'spec' in field ? field.spec : undefined;
            let strict = fieldSpec == null ? void 0 : fieldSpec.strict;

            if (fieldSpec == null ? void 0 : fieldSpec.strip) {
              isChanged = isChanged || prop in value;
              continue;
            }

            fieldValue = !options.__validating || !strict ? // TODO: use _cast, this is double resolving
            field.cast(value[prop], innerOptions) : value[prop];

            if (fieldValue !== undefined) {
              intermediateValue[prop] = fieldValue;
            }
          } else if (exists && !strip) {
            intermediateValue[prop] = value[prop];
          }

          if (intermediateValue[prop] !== value[prop]) {
            isChanged = true;
          }
        }

        return isChanged ? intermediateValue : value;
      }

      _validate(_value, opts = {}, callback) {
        let errors = [];
        let {
          sync,
          from = [],
          originalValue = _value,
          abortEarly = this.spec.abortEarly,
          recursive = this.spec.recursive
        } = opts;
        from = [{
          schema: this,
          value: originalValue
        }, ...from]; // this flag is needed for handling `strict` correctly in the context of
        // validation vs just casting. e.g strict() on a field is only used when validating

        opts.__validating = true;
        opts.originalValue = originalValue;
        opts.from = from;

        super._validate(_value, opts, (err, value) => {
          if (err) {
            if (!ValidationError.isError(err) || abortEarly) {
              return void callback(err, value);
            }

            errors.push(err);
          }

          if (!recursive || !isObject(value)) {
            callback(errors[0] || null, value);
            return;
          }

          originalValue = originalValue || value;

          let tests = this._nodes.map(key => (_, cb) => {
            let path = key.indexOf('.') === -1 ? (opts.path ? `${opts.path}.` : '') + key : `${opts.path || ''}["${key}"]`;
            let field = this.fields[key];

            if (field && 'validate' in field) {
              field.validate(value[key], _extends$1({}, opts, {
                // @ts-ignore
                path,
                from,
                // inner fields are always strict:
                // 1. this isn't strict so the casting will also have cast inner values
                // 2. this is strict in which case the nested values weren't cast either
                strict: true,
                parent: value,
                originalValue: originalValue[key]
              }), cb);
              return;
            }

            cb(null);
          });

          runTests({
            sync,
            tests,
            value,
            errors,
            endEarly: abortEarly,
            sort: this._sortErrors,
            path: opts.path
          }, callback);
        });
      }

      clone(spec) {
        const next = super.clone(spec);
        next.fields = _extends$1({}, this.fields);
        next._nodes = this._nodes;
        next._excludedEdges = this._excludedEdges;
        next._sortErrors = this._sortErrors;
        return next;
      }

      concat(schema) {
        let next = super.concat(schema);
        let nextFields = next.fields;

        for (let [field, schemaOrRef] of Object.entries(this.fields)) {
          const target = nextFields[field];

          if (target === undefined) {
            nextFields[field] = schemaOrRef;
          } else if (target instanceof BaseSchema && schemaOrRef instanceof BaseSchema) {
            nextFields[field] = schemaOrRef.concat(target);
          }
        }

        return next.withMutation(() => next.shape(nextFields, this._excludedEdges));
      }

      getDefaultFromShape() {
        let dft = {};

        this._nodes.forEach(key => {
          const field = this.fields[key];
          dft[key] = 'default' in field ? field.getDefault() : undefined;
        });

        return dft;
      }

      _getDefault() {
        if ('default' in this.spec) {
          return super._getDefault();
        } // if there is no default set invent one


        if (!this._nodes.length) {
          return undefined;
        }

        return this.getDefaultFromShape();
      }

      shape(additions, excludes = []) {
        let next = this.clone();
        let fields = Object.assign(next.fields, additions);
        next.fields = fields;
        next._sortErrors = sortByKeyOrder(Object.keys(fields));

        if (excludes.length) {
          // this is a convenience for when users only supply a single pair
          if (!Array.isArray(excludes[0])) excludes = [excludes];
          next._excludedEdges = [...next._excludedEdges, ...excludes];
        }

        next._nodes = sortFields(fields, next._excludedEdges);
        return next;
      }

      pick(keys) {
        const picked = {};

        for (const key of keys) {
          if (this.fields[key]) picked[key] = this.fields[key];
        }

        return this.clone().withMutation(next => {
          next.fields = {};
          return next.shape(picked);
        });
      }

      omit(keys) {
        const next = this.clone();
        const fields = next.fields;
        next.fields = {};

        for (const key of keys) {
          delete fields[key];
        }

        return next.withMutation(() => next.shape(fields));
      }

      from(from, to, alias) {
        let fromGetter = propertyExpr.getter(from, true);
        return this.transform(obj => {
          if (obj == null) return obj;
          let newObj = obj;

          if (has_1(obj, from)) {
            newObj = _extends$1({}, obj);
            if (!alias) delete newObj[from];
            newObj[to] = fromGetter(obj);
          }

          return newObj;
        });
      }

      noUnknown(noAllow = true, message = object.noUnknown) {
        if (typeof noAllow === 'string') {
          message = noAllow;
          noAllow = true;
        }

        let next = this.test({
          name: 'noUnknown',
          exclusive: true,
          message: message,

          test(value) {
            if (value == null) return true;
            const unknownKeys = unknown(this.schema, value);
            return !noAllow || unknownKeys.length === 0 || this.createError({
              params: {
                unknown: unknownKeys.join(', ')
              }
            });
          }

        });
        next.spec.noUnknown = noAllow;
        return next;
      }

      unknown(allow = true, message = object.noUnknown) {
        return this.noUnknown(!allow, message);
      }

      transformKeys(fn) {
        return this.transform(obj => obj && mapKeys_1(obj, (_, key) => fn(key)));
      }

      camelCase() {
        return this.transformKeys(camelCase_1);
      }

      snakeCase() {
        return this.transformKeys(snakeCase_1);
      }

      constantCase() {
        return this.transformKeys(key => snakeCase_1(key).toUpperCase());
      }

      describe() {
        let base = super.describe();
        base.fields = mapValues_1(this.fields, value => value.describe());
        return base;
      }

    }
    function create$2(spec) {
      return new ObjectSchema(spec);
    }
    create$2.prototype = ObjectSchema.prototype;

    function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
    function create$1(type) {
      return new ArraySchema(type);
    }
    class ArraySchema extends BaseSchema {
      constructor(type) {
        super({
          type: 'array'
        }); // `undefined` specifically means uninitialized, as opposed to
        // "no subtype"

        this.innerType = void 0;
        this.innerType = type;
        this.withMutation(() => {
          this.transform(function (values) {
            if (typeof values === 'string') try {
              values = JSON.parse(values);
            } catch (err) {
              values = null;
            }
            return this.isType(values) ? values : null;
          });
        });
      }

      _typeCheck(v) {
        return Array.isArray(v);
      }

      get _subType() {
        return this.innerType;
      }

      _cast(_value, _opts) {
        const value = super._cast(_value, _opts); //should ignore nulls here


        if (!this._typeCheck(value) || !this.innerType) return value;
        let isChanged = false;
        const castArray = value.map((v, idx) => {
          const castElement = this.innerType.cast(v, _extends({}, _opts, {
            path: `${_opts.path || ''}[${idx}]`
          }));

          if (castElement !== v) {
            isChanged = true;
          }

          return castElement;
        });
        return isChanged ? castArray : value;
      }

      _validate(_value, options = {}, callback) {
        var _options$abortEarly, _options$recursive;

        let errors = [];
        let sync = options.sync;
        let path = options.path;
        let innerType = this.innerType;
        let endEarly = (_options$abortEarly = options.abortEarly) != null ? _options$abortEarly : this.spec.abortEarly;
        let recursive = (_options$recursive = options.recursive) != null ? _options$recursive : this.spec.recursive;
        let originalValue = options.originalValue != null ? options.originalValue : _value;

        super._validate(_value, options, (err, value) => {
          if (err) {
            if (!ValidationError.isError(err) || endEarly) {
              return void callback(err, value);
            }

            errors.push(err);
          }

          if (!recursive || !innerType || !this._typeCheck(value)) {
            callback(errors[0] || null, value);
            return;
          }

          originalValue = originalValue || value; // #950 Ensure that sparse array empty slots are validated

          let tests = new Array(value.length);

          for (let idx = 0; idx < value.length; idx++) {
            let item = value[idx];
            let path = `${options.path || ''}[${idx}]`; // object._validate note for isStrict explanation

            let innerOptions = _extends({}, options, {
              path,
              strict: true,
              parent: value,
              index: idx,
              originalValue: originalValue[idx]
            });

            tests[idx] = (_, cb) => innerType.validate(item, innerOptions, cb);
          }

          runTests({
            sync,
            path,
            value,
            errors,
            endEarly,
            tests
          }, callback);
        });
      }

      clone(spec) {
        const next = super.clone(spec);
        next.innerType = this.innerType;
        return next;
      }

      concat(schema) {
        let next = super.concat(schema);
        next.innerType = this.innerType;
        if (schema.innerType) next.innerType = next.innerType ? // @ts-expect-error Lazy doesn't have concat()
        next.innerType.concat(schema.innerType) : schema.innerType;
        return next;
      }

      of(schema) {
        // FIXME: this should return a new instance of array without the default to be
        let next = this.clone();
        if (!isSchema(schema)) throw new TypeError('`array.of()` sub-schema must be a valid yup schema not: ' + printValue(schema)); // FIXME(ts):

        next.innerType = schema;
        return next;
      }

      length(length, message = array$1.length) {
        return this.test({
          message,
          name: 'length',
          exclusive: true,
          params: {
            length
          },

          test(value) {
            return isAbsent(value) || value.length === this.resolve(length);
          }

        });
      }

      min(min, message) {
        message = message || array$1.min;
        return this.test({
          message,
          name: 'min',
          exclusive: true,
          params: {
            min
          },

          // FIXME(ts): Array<typeof T>
          test(value) {
            return isAbsent(value) || value.length >= this.resolve(min);
          }

        });
      }

      max(max, message) {
        message = message || array$1.max;
        return this.test({
          message,
          name: 'max',
          exclusive: true,
          params: {
            max
          },

          test(value) {
            return isAbsent(value) || value.length <= this.resolve(max);
          }

        });
      }

      ensure() {
        return this.default(() => []).transform((val, original) => {
          // We don't want to return `null` for nullable schema
          if (this._typeCheck(val)) return val;
          return original == null ? [] : [].concat(original);
        });
      }

      compact(rejector) {
        let reject = !rejector ? v => !!v : (v, i, a) => !rejector(v, i, a);
        return this.transform(values => values != null ? values.filter(reject) : values);
      }

      describe() {
        let base = super.describe();
        if (this.innerType) base.innerType = this.innerType.describe();
        return base;
      }

      nullable(isNullable = true) {
        return super.nullable(isNullable);
      }

      defined() {
        return super.defined();
      }

      required(msg) {
        return super.required(msg);
      }

    }
    create$1.prototype = ArraySchema.prototype; //
    // Interfaces
    //

    function create(builder) {
      return new Lazy(builder);
    }

    class Lazy {
      constructor(builder) {
        this.type = 'lazy';
        this.__isYupSchema__ = true;
        this.__inputType = void 0;
        this.__outputType = void 0;

        this._resolve = (value, options = {}) => {
          let schema = this.builder(value, options);
          if (!isSchema(schema)) throw new TypeError('lazy() functions must return a valid schema');
          return schema.resolve(options);
        };

        this.builder = builder;
      }

      resolve(options) {
        return this._resolve(options.value, options);
      }

      cast(value, options) {
        return this._resolve(value, options).cast(value, options);
      }

      validate(value, options, maybeCb) {
        // @ts-expect-error missing public callback on type
        return this._resolve(value, options).validate(value, options, maybeCb);
      }

      validateSync(value, options) {
        return this._resolve(value, options).validateSync(value, options);
      }

      validateAt(path, value, options) {
        return this._resolve(value, options).validateAt(path, value, options);
      }

      validateSyncAt(path, value, options) {
        return this._resolve(value, options).validateSyncAt(path, value, options);
      }

      describe() {
        return null;
      }

      isValid(value, options) {
        return this._resolve(value, options).isValid(value, options);
      }

      isValidSync(value, options) {
        return this._resolve(value, options).isValidSync(value, options);
      }

    }

    function setLocale(custom) {
      Object.keys(custom).forEach(type => {
        // @ts-ignore
        Object.keys(custom[type]).forEach(method => {
          // @ts-ignore
          locale[type][method] = custom[type][method];
        });
      });
    }

    function addMethod(schemaType, name, fn) {
      if (!schemaType || !isSchema(schemaType.prototype)) throw new TypeError('You must provide a yup schema constructor function');
      if (typeof name !== 'string') throw new TypeError('A Method name must be provided');
      if (typeof fn !== 'function') throw new TypeError('Method function must be provided');
      schemaType.prototype[name] = fn;
    }

    var Yup = /*#__PURE__*/Object.freeze({
        __proto__: null,
        mixed: create$7,
        bool: create$6,
        boolean: create$6,
        string: create$5,
        number: create$4,
        date: create$3,
        object: create$2,
        array: create$1,
        ref: create$8,
        lazy: create,
        reach: reach,
        isSchema: isSchema,
        addMethod: addMethod,
        setLocale: setLocale,
        ValidationError: ValidationError,
        BaseSchema: BaseSchema,
        MixedSchema: Mixed,
        BooleanSchema: BooleanSchema,
        StringSchema: StringSchema,
        NumberSchema: NumberSchema,
        DateSchema: DateSchema,
        ObjectSchema: ObjectSchema,
        ArraySchema: ArraySchema
    });

    /* src/routes/checkout/informationStep.svelte generated by Svelte v3.44.1 */

    const { console: console_1$2 } = globals;
    const file$d = "src/routes/checkout/informationStep.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i].display_name;
    	child_ctx[9] = list[i].iso_2;
    	return child_ctx;
    }

    // (158:4) {:else}
    function create_else_block$7(ctx) {
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*cart*/ ctx[1].region.countries;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "class", "cursor-pointer mb-2 shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ");
    			attr_dev(select, "name", "country");
    			if (/*country_code*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
    			add_location(select, file$d, 158, 6, 4113);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*country_code*/ ctx[2]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[4]),
    					listen_dev(select, "change", /*change_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart*/ 2) {
    				each_value = /*cart*/ ctx[1].region.countries;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*country_code, cart*/ 6) {
    				select_option(select, /*country_code*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(158:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (156:4) {#if informationLoader}
    function create_if_block$7(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading available countries";
    			add_location(p, file$d, 156, 6, 4060);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(156:4) {#if informationLoader}",
    		ctx
    	});

    	return block;
    }

    // (170:8) {#each cart.region.countries as { display_name, iso_2 }}
    function create_each_block$5(ctx) {
    	let option;
    	let t0_value = /*display_name*/ ctx[8] + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*iso_2*/ ctx[9];
    			option.value = option.__value;
    			add_location(option, file$d, 170, 10, 4617);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cart*/ 2 && t0_value !== (t0_value = /*display_name*/ ctx[8] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*cart*/ 2 && option_value_value !== (option_value_value = /*iso_2*/ ctx[9])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(170:8) {#each cart.region.countries as { display_name, iso_2 }}",
    		ctx
    	});

    	return block;
    }

    // (50:0) <Form   validationSchema={Schema}   initialValues={{     address: "",     firstName: "",     lastName: "",     city: "",     country: "",     postalCode: "",     phoneNo: "",     email: "",     address2: "",   }}   onSubmit={async ({     address,     address2,     firstName,     lastName,     phoneNo,     postalCode,     email,     city,   }) => {     try {       await addCartInfo(         {           address_1: address,           address_2: address2,           city,           country_code: country_code,           first_name: firstName,           last_name: lastName,           phone: phoneNo,           postal_code: postalCode,         },         email       );     } catch (e) {       console.log(e);     }   }} >
    function create_default_slot$7(ctx) {
    	let h2;
    	let t1;
    	let div0;
    	let field0;
    	let t2;
    	let errormessage0;
    	let t3;
    	let div1;
    	let field1;
    	let t4;
    	let errormessage1;
    	let t5;
    	let div2;
    	let field2;
    	let t6;
    	let errormessage2;
    	let t7;
    	let div3;
    	let field3;
    	let t8;
    	let errormessage3;
    	let t9;
    	let div4;
    	let field4;
    	let t10;
    	let errormessage4;
    	let t11;
    	let div5;
    	let t12;
    	let div8;
    	let div6;
    	let field5;
    	let t13;
    	let errormessage5;
    	let t14;
    	let div7;
    	let field6;
    	let t15;
    	let errormessage6;
    	let t16;
    	let div9;
    	let field7;
    	let t17;
    	let errormessage7;
    	let t18;
    	let button;
    	let current;

    	field0 = new Field({
    			props: {
    				class: "shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline",
    				id: "firstName",
    				placeholder: "First Name",
    				type: "text",
    				name: "firstName"
    			},
    			$$inline: true
    		});

    	errormessage0 = new ErrorMessage({
    			props: { name: "firstName" },
    			$$inline: true
    		});

    	field1 = new Field({
    			props: {
    				class: "shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline",
    				name: "lastName",
    				placeholder: "Last Name",
    				type: "text"
    			},
    			$$inline: true
    		});

    	errormessage1 = new ErrorMessage({
    			props: { name: "lastName" },
    			$$inline: true
    		});

    	field2 = new Field({
    			props: {
    				class: "shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline",
    				name: "email",
    				placeholder: "Email",
    				type: "email"
    			},
    			$$inline: true
    		});

    	errormessage2 = new ErrorMessage({ props: { name: "email" }, $$inline: true });

    	field3 = new Field({
    			props: {
    				class: "shadow appearance-none border\n                 border-grey-500 rounded\n                 w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline",
    				name: "address",
    				placeholder: "Address 1",
    				type: "text"
    			},
    			$$inline: true
    		});

    	errormessage3 = new ErrorMessage({
    			props: { name: "address" },
    			$$inline: true
    		});

    	field4 = new Field({
    			props: {
    				class: "shadow appearance-none\n                        border border-grey-500\n                        rounded w-full py-2 px-3\n                        text-gray-700 mb-3 leading-tight\n                        focus:outline-none focus:shadow-outline",
    				name: "address2",
    				placeholder: "Address 2 (Optional)",
    				type: "text"
    			},
    			$$inline: true
    		});

    	errormessage4 = new ErrorMessage({
    			props: { name: "address2" },
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*informationLoader*/ ctx[0]) return create_if_block$7;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	field5 = new Field({
    			props: {
    				class: "shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline",
    				name: "postalCode",
    				placeholder: "Postal Code",
    				type: "number"
    			},
    			$$inline: true
    		});

    	errormessage5 = new ErrorMessage({
    			props: { name: "postalCode" },
    			$$inline: true
    		});

    	field6 = new Field({
    			props: {
    				class: "shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline",
    				name: "city",
    				placeholder: "City",
    				type: "text"
    			},
    			$$inline: true
    		});

    	errormessage6 = new ErrorMessage({ props: { name: "city" }, $$inline: true });

    	field7 = new Field({
    			props: {
    				class: "shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline",
    				name: "phoneNo",
    				placeholder: "Phone",
    				type: "number"
    			},
    			$$inline: true
    		});

    	errormessage7 = new ErrorMessage({
    			props: { name: "phoneNo" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Address";
    			t1 = space();
    			div0 = element("div");
    			create_component(field0.$$.fragment);
    			t2 = space();
    			create_component(errormessage0.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			create_component(field1.$$.fragment);
    			t4 = space();
    			create_component(errormessage1.$$.fragment);
    			t5 = space();
    			div2 = element("div");
    			create_component(field2.$$.fragment);
    			t6 = space();
    			create_component(errormessage2.$$.fragment);
    			t7 = space();
    			div3 = element("div");
    			create_component(field3.$$.fragment);
    			t8 = space();
    			create_component(errormessage3.$$.fragment);
    			t9 = space();
    			div4 = element("div");
    			create_component(field4.$$.fragment);
    			t10 = space();
    			create_component(errormessage4.$$.fragment);
    			t11 = space();
    			div5 = element("div");
    			if_block.c();
    			t12 = space();
    			div8 = element("div");
    			div6 = element("div");
    			create_component(field5.$$.fragment);
    			t13 = space();
    			create_component(errormessage5.$$.fragment);
    			t14 = space();
    			div7 = element("div");
    			create_component(field6.$$.fragment);
    			t15 = space();
    			create_component(errormessage6.$$.fragment);
    			t16 = space();
    			div9 = element("div");
    			create_component(field7.$$.fragment);
    			t17 = space();
    			create_component(errormessage7.$$.fragment);
    			t18 = space();
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(h2, "class", "font-semibold text-2xl mb-5 mt-5 ml-2");
    			add_location(h2, file$d, 91, 2, 2189);
    			attr_dev(div0, "class", "mb-2 m-2");
    			add_location(div0, file$d, 93, 2, 2255);
    			attr_dev(div1, "class", "mb-2 m-2");
    			add_location(div1, file$d, 105, 2, 2598);
    			attr_dev(div2, "class", "mb-2 m-2");
    			add_location(div2, file$d, 116, 2, 2917);
    			attr_dev(div3, "class", "mb-2 m-2");
    			add_location(div3, file$d, 126, 2, 3226);
    			attr_dev(div4, "class", "mb-2 m-2");
    			add_location(div4, file$d, 139, 2, 3577);
    			attr_dev(div5, "class", "mb-2 m-2");
    			add_location(div5, file$d, 154, 2, 4003);
    			attr_dev(div6, "class", "w-full md:w-1/2 px-2 mb-3 md:mb-0");
    			add_location(div6, file$d, 179, 4, 4782);
    			attr_dev(div7, "class", "w-full md:w-1/2 px-2");
    			add_location(div7, file$d, 189, 4, 5151);
    			attr_dev(div8, "class", "flex flex-wrap m-2mb-2");
    			add_location(div8, file$d, 178, 2, 4741);
    			attr_dev(div9, "class", "mb-2 m-2");
    			add_location(div9, file$d, 201, 2, 5494);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "custom-btn mb-2 m-2");
    			add_location(button, file$d, 212, 2, 5809);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			mount_component(field0, div0, null);
    			append_dev(div0, t2);
    			mount_component(errormessage0, div0, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(field1, div1, null);
    			append_dev(div1, t4);
    			mount_component(errormessage1, div1, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(field2, div2, null);
    			append_dev(div2, t6);
    			mount_component(errormessage2, div2, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(field3, div3, null);
    			append_dev(div3, t8);
    			mount_component(errormessage3, div3, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div4, anchor);
    			mount_component(field4, div4, null);
    			append_dev(div4, t10);
    			mount_component(errormessage4, div4, null);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div5, anchor);
    			if_block.m(div5, null);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			mount_component(field5, div6, null);
    			append_dev(div6, t13);
    			mount_component(errormessage5, div6, null);
    			append_dev(div8, t14);
    			append_dev(div8, div7);
    			mount_component(field6, div7, null);
    			append_dev(div7, t15);
    			mount_component(errormessage6, div7, null);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, div9, anchor);
    			mount_component(field7, div9, null);
    			append_dev(div9, t17);
    			mount_component(errormessage7, div9, null);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, button, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div5, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(field0.$$.fragment, local);
    			transition_in(errormessage0.$$.fragment, local);
    			transition_in(field1.$$.fragment, local);
    			transition_in(errormessage1.$$.fragment, local);
    			transition_in(field2.$$.fragment, local);
    			transition_in(errormessage2.$$.fragment, local);
    			transition_in(field3.$$.fragment, local);
    			transition_in(errormessage3.$$.fragment, local);
    			transition_in(field4.$$.fragment, local);
    			transition_in(errormessage4.$$.fragment, local);
    			transition_in(field5.$$.fragment, local);
    			transition_in(errormessage5.$$.fragment, local);
    			transition_in(field6.$$.fragment, local);
    			transition_in(errormessage6.$$.fragment, local);
    			transition_in(field7.$$.fragment, local);
    			transition_in(errormessage7.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(field0.$$.fragment, local);
    			transition_out(errormessage0.$$.fragment, local);
    			transition_out(field1.$$.fragment, local);
    			transition_out(errormessage1.$$.fragment, local);
    			transition_out(field2.$$.fragment, local);
    			transition_out(errormessage2.$$.fragment, local);
    			transition_out(field3.$$.fragment, local);
    			transition_out(errormessage3.$$.fragment, local);
    			transition_out(field4.$$.fragment, local);
    			transition_out(errormessage4.$$.fragment, local);
    			transition_out(field5.$$.fragment, local);
    			transition_out(errormessage5.$$.fragment, local);
    			transition_out(field6.$$.fragment, local);
    			transition_out(errormessage6.$$.fragment, local);
    			transition_out(field7.$$.fragment, local);
    			transition_out(errormessage7.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			destroy_component(field0);
    			destroy_component(errormessage0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			destroy_component(field1);
    			destroy_component(errormessage1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);
    			destroy_component(field2);
    			destroy_component(errormessage2);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div3);
    			destroy_component(field3);
    			destroy_component(errormessage3);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div4);
    			destroy_component(field4);
    			destroy_component(errormessage4);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div5);
    			if_block.d();
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div8);
    			destroy_component(field5);
    			destroy_component(errormessage5);
    			destroy_component(field6);
    			destroy_component(errormessage6);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(div9);
    			destroy_component(field7);
    			destroy_component(errormessage7);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(50:0) <Form   validationSchema={Schema}   initialValues={{     address: \\\"\\\",     firstName: \\\"\\\",     lastName: \\\"\\\",     city: \\\"\\\",     country: \\\"\\\",     postalCode: \\\"\\\",     phoneNo: \\\"\\\",     email: \\\"\\\",     address2: \\\"\\\",   }}   onSubmit={async ({     address,     address2,     firstName,     lastName,     phoneNo,     postalCode,     email,     city,   }) => {     try {       await addCartInfo(         {           address_1: address,           address_2: address2,           city,           country_code: country_code,           first_name: firstName,           last_name: lastName,           phone: phoneNo,           postal_code: postalCode,         },         email       );     } catch (e) {       console.log(e);     }   }} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				validationSchema: /*Schema*/ ctx[3],
    				initialValues: {
    					address: "",
    					firstName: "",
    					lastName: "",
    					city: "",
    					country: "",
    					postalCode: "",
    					phoneNo: "",
    					email: "",
    					address2: ""
    				},
    				onSubmit: /*func*/ ctx[6],
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(form.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(form, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const form_changes = {};
    			if (dirty & /*country_code*/ 4) form_changes.onSubmit = /*func*/ ctx[6];

    			if (dirty & /*$$scope, informationLoader, country_code, cart*/ 4103) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(form, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InformationStep', slots, []);
    	let informationLoader = true;
    	let cart;
    	let currentCheckoutState;

    	checkoutStore.subscribe(state => {
    		currentCheckoutState = state?.currentCheckoutStep;
    	});

    	let country_code;

    	medusaCartState.subscribe(state => {
    		retrieve;
    		$$invalidate(1, cart = state.cart);

    		if (state.cart.region) {
    			// select a default country
    			$$invalidate(2, country_code = state.cart.region.countries[0].iso_2);

    			$$invalidate(0, informationLoader = false);
    		}
    	});

    	let Schema = create$2().shape({
    		firstName: create$5().min(2, "First name is too short").max(50, "First name is too long").required("Required"),
    		lastName: create$5().min(2, "Last name is too short").max(50, "Last name is too long").required("Required"),
    		email: create$5().email("Invalid email").required("Required"),
    		address: create$5().required("Required").max(45, "Address limit is 45 characters"),
    		address2: create$5().nullable(true).max(45, "Address limit is 45 characters"),
    		postalCode: create$5().required("Required"),
    		city: create$5().required("Required"),
    		province: create$5().nullable(true),
    		phoneNo: create$5().required("Required")
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<InformationStep> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		country_code = select_value(this);
    		$$invalidate(2, country_code);
    		$$invalidate(1, cart);
    	}

    	const change_handler = ({ target }) => $$invalidate(2, country_code = target.value);

    	const func = async ({ address, address2, firstName, lastName, phoneNo, postalCode, email, city }) => {
    		try {
    			await addCartInfo(
    				{
    					address_1: address,
    					address_2: address2,
    					city,
    					country_code,
    					first_name: firstName,
    					last_name: lastName,
    					phone: phoneNo,
    					postal_code: postalCode
    				},
    				email
    			);
    		} catch(e) {
    			console.log(e);
    		}
    	};

    	$$self.$capture_state = () => ({
    		ErrorMessage,
    		Field,
    		Form,
    		Yup,
    		addCartInfo,
    		medusaCartState,
    		checkoutStore,
    		informationLoader,
    		cart,
    		currentCheckoutState,
    		country_code,
    		Schema
    	});

    	$$self.$inject_state = $$props => {
    		if ('informationLoader' in $$props) $$invalidate(0, informationLoader = $$props.informationLoader);
    		if ('cart' in $$props) $$invalidate(1, cart = $$props.cart);
    		if ('currentCheckoutState' in $$props) currentCheckoutState = $$props.currentCheckoutState;
    		if ('country_code' in $$props) $$invalidate(2, country_code = $$props.country_code);
    		if ('Schema' in $$props) $$invalidate(3, Schema = $$props.Schema);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		informationLoader,
    		cart,
    		country_code,
    		Schema,
    		select_change_handler,
    		change_handler,
    		func
    	];
    }

    class InformationStep extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InformationStep",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/orderItemPreview.svelte generated by Svelte v3.44.1 */

    const file$c = "src/components/orderItemPreview.svelte";

    function create_fragment$e(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let ul;
    	let li0;
    	let p0;
    	let t1;
    	let t2;
    	let li1;
    	let p1;
    	let t3;
    	let t4;
    	let t5;
    	let li2;
    	let p2;
    	let t6;
    	let t7;
    	let t8;
    	let li3;
    	let p3;
    	let t9;
    	let t10;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			p0 = element("p");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			li1 = element("li");
    			p1 = element("p");
    			t3 = text("Size: ");
    			t4 = text(/*size*/ ctx[2]);
    			t5 = space();
    			li2 = element("li");
    			p2 = element("p");
    			t6 = text("Price: ");
    			t7 = text(/*price*/ ctx[3]);
    			t8 = space();
    			li3 = element("li");
    			p3 = element("p");
    			t9 = text("Quantity: ");
    			t10 = text(/*quantity*/ ctx[4]);
    			attr_dev(img, "class", "cart-image svelte-12jic58");
    			attr_dev(img, "alt", "Cart item");
    			if (!src_url_equal(img.src, img_src_value = /*orderThumbnail*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			add_location(img, file$c, 10, 4, 190);
    			add_location(p0, file$c, 14, 8, 296);
    			attr_dev(li0, "class", "svelte-12jic58");
    			add_location(li0, file$c, 13, 6, 283);
    			attr_dev(p1, "class", "sub-text svelte-12jic58");
    			add_location(p1, file$c, 17, 8, 341);
    			attr_dev(li1, "class", "svelte-12jic58");
    			add_location(li1, file$c, 16, 6, 328);
    			attr_dev(p2, "class", "sub-text svelte-12jic58");
    			add_location(p2, file$c, 20, 8, 409);
    			attr_dev(li2, "class", "svelte-12jic58");
    			add_location(li2, file$c, 19, 6, 396);
    			attr_dev(p3, "class", "sub-text svelte-12jic58");
    			add_location(p3, file$c, 23, 8, 479);
    			attr_dev(li3, "class", "svelte-12jic58");
    			add_location(li3, file$c, 22, 6, 466);
    			attr_dev(ul, "class", "ml-5 svelte-12jic58");
    			add_location(ul, file$c, 12, 4, 259);
    			set_style(div0, "display", "flex");
    			add_location(div0, file$c, 9, 2, 158);
    			attr_dev(div1, "class", "product-ctn svelte-12jic58");
    			add_location(div1, file$c, 8, 0, 130);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, p0);
    			append_dev(p0, t1);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, p1);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, p2);
    			append_dev(p2, t6);
    			append_dev(p2, t7);
    			append_dev(ul, t8);
    			append_dev(ul, li3);
    			append_dev(li3, p3);
    			append_dev(p3, t9);
    			append_dev(p3, t10);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*orderThumbnail*/ 2 && !src_url_equal(img.src, img_src_value = /*orderThumbnail*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			if (dirty & /*size*/ 4) set_data_dev(t4, /*size*/ ctx[2]);
    			if (dirty & /*price*/ 8) set_data_dev(t7, /*price*/ ctx[3]);
    			if (dirty & /*quantity*/ 16) set_data_dev(t10, /*quantity*/ ctx[4]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OrderItemPreview', slots, []);
    	let { name } = $$props;
    	let { orderThumbnail } = $$props;
    	let { size } = $$props;
    	let { price } = $$props;
    	let { quantity } = $$props;
    	const writable_props = ['name', 'orderThumbnail', 'size', 'price', 'quantity'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OrderItemPreview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('orderThumbnail' in $$props) $$invalidate(1, orderThumbnail = $$props.orderThumbnail);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('price' in $$props) $$invalidate(3, price = $$props.price);
    		if ('quantity' in $$props) $$invalidate(4, quantity = $$props.quantity);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		orderThumbnail,
    		size,
    		price,
    		quantity
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('orderThumbnail' in $$props) $$invalidate(1, orderThumbnail = $$props.orderThumbnail);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('price' in $$props) $$invalidate(3, price = $$props.price);
    		if ('quantity' in $$props) $$invalidate(4, quantity = $$props.quantity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, orderThumbnail, size, price, quantity];
    }

    class OrderItemPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			name: 0,
    			orderThumbnail: 1,
    			size: 2,
    			price: 3,
    			quantity: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OrderItemPreview",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<OrderItemPreview> was created without expected prop 'name'");
    		}

    		if (/*orderThumbnail*/ ctx[1] === undefined && !('orderThumbnail' in props)) {
    			console.warn("<OrderItemPreview> was created without expected prop 'orderThumbnail'");
    		}

    		if (/*size*/ ctx[2] === undefined && !('size' in props)) {
    			console.warn("<OrderItemPreview> was created without expected prop 'size'");
    		}

    		if (/*price*/ ctx[3] === undefined && !('price' in props)) {
    			console.warn("<OrderItemPreview> was created without expected prop 'price'");
    		}

    		if (/*quantity*/ ctx[4] === undefined && !('quantity' in props)) {
    			console.warn("<OrderItemPreview> was created without expected prop 'quantity'");
    		}
    	}

    	get name() {
    		throw new Error("<OrderItemPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<OrderItemPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orderThumbnail() {
    		throw new Error("<OrderItemPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orderThumbnail(value) {
    		throw new Error("<OrderItemPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<OrderItemPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<OrderItemPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get price() {
    		throw new Error("<OrderItemPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set price(value) {
    		throw new Error("<OrderItemPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get quantity() {
    		throw new Error("<OrderItemPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quantity(value) {
    		throw new Error("<OrderItemPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/checkout/orderSummary.svelte generated by Svelte v3.44.1 */
    const file$b = "src/routes/checkout/orderSummary.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].thumbnail;
    	child_ctx[4] = list[i].variant;
    	child_ctx[5] = list[i].unit_price;
    	child_ctx[6] = list[i].quantity;
    	child_ctx[7] = list[i].title;
    	return child_ctx;
    }

    // (27:0) {:else}
    function create_else_block$6(ctx) {
    	let div6;
    	let div1;
    	let div0;
    	let h2;
    	let t1;

    	let t2_value = (/*userCart*/ ctx[0].items.length > 0
    	? /*userCart*/ ctx[0]?.items.map(quantity).reduce(sum)
    	: 0) + "";

    	let t2;
    	let t3_value = " " + "";
    	let t3;
    	let t4;

    	let t5_value = (/*userCart*/ ctx[0]?.items.length > 0 && /*userCart*/ ctx[0]?.items.map(quantity).reduce(sum) === 1
    	? "item"
    	: "items") + "";

    	let t5;
    	let t6;
    	let hr;
    	let t7;
    	let ul;
    	let t8;
    	let div5;
    	let div2;
    	let p0;
    	let t10;
    	let p1;
    	let t11_value = formatPrice(/*userCart*/ ctx[0].subtotal, /*userCart*/ ctx[0].region.currency_code) + "";
    	let t11;
    	let t12;
    	let div3;
    	let p2;
    	let t14;
    	let p3;

    	let t15_value = (/*userCart*/ ctx[0].region
    	? formatPrice(/*userCart*/ ctx[0].shipping_total, /*userCart*/ ctx[0].region.currency_code)
    	: 0) + "";

    	let t15;
    	let t16;
    	let div4;
    	let p4;
    	let t18;
    	let p5;
    	let t19_value = formatPrice(/*userCart*/ ctx[0].subtotal, /*userCart*/ ctx[0].region.currency_code) + "";
    	let t19;
    	let current;
    	let each_value = /*userCart*/ ctx[0].items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Order Summary";
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			hr = element("hr");
    			t7 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div5 = element("div");
    			div2 = element("div");
    			p0 = element("p");
    			p0.textContent = "Subtotal (incl. taxes)";
    			t10 = space();
    			p1 = element("p");
    			t11 = text(t11_value);
    			t12 = space();
    			div3 = element("div");
    			p2 = element("p");
    			p2.textContent = "Shipping";
    			t14 = space();
    			p3 = element("p");
    			t15 = text(t15_value);
    			t16 = space();
    			div4 = element("div");
    			p4 = element("p");
    			p4.textContent = "Total";
    			t18 = space();
    			p5 = element("p");
    			t19 = text(t19_value);
    			attr_dev(h2, "class", "font-semibold text-lg");
    			add_location(h2, file$b, 30, 8, 724);
    			attr_dev(div0, "class", "flex justify-between mb-5");
    			add_location(div0, file$b, 29, 6, 676);
    			attr_dev(hr, "class", "mb-5");
    			add_location(hr, file$b, 40, 6, 1041);
    			add_location(ul, file$b, 41, 6, 1067);
    			add_location(div1, file$b, 28, 4, 664);
    			add_location(p0, file$b, 58, 8, 1559);
    			add_location(p1, file$b, 59, 8, 1597);
    			attr_dev(div2, "class", "flex justify-between mb-3 ");
    			add_location(div2, file$b, 57, 6, 1510);
    			add_location(p2, file$b, 63, 8, 1736);
    			add_location(p3, file$b, 64, 8, 1760);
    			attr_dev(div3, "class", "flex justify-between mb-3");
    			add_location(div3, file$b, 62, 6, 1688);
    			attr_dev(p4, "class", "font-semibold ");
    			add_location(p4, file$b, 75, 8, 2019);
    			attr_dev(p5, "class", "font-semibold ");
    			add_location(p5, file$b, 76, 8, 2063);
    			attr_dev(div4, "class", "flex justify-between mb-3");
    			add_location(div4, file$b, 74, 6, 1971);
    			attr_dev(div5, "class", "bottom");
    			add_location(div5, file$b, 56, 4, 1483);
    			attr_dev(div6, "class", "order-summary svelte-1i2t24f");
    			add_location(div6, file$b, 27, 2, 632);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, t5);
    			append_dev(div1, t6);
    			append_dev(div1, hr);
    			append_dev(div1, t7);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, p0);
    			append_dev(div2, t10);
    			append_dev(div2, p1);
    			append_dev(p1, t11);
    			append_dev(div5, t12);
    			append_dev(div5, div3);
    			append_dev(div3, p2);
    			append_dev(div3, t14);
    			append_dev(div3, p3);
    			append_dev(p3, t15);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			append_dev(div4, p4);
    			append_dev(div4, t18);
    			append_dev(div4, p5);
    			append_dev(p5, t19);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*userCart*/ 1) && t2_value !== (t2_value = (/*userCart*/ ctx[0].items.length > 0
    			? /*userCart*/ ctx[0]?.items.map(quantity).reduce(sum)
    			: 0) + "")) set_data_dev(t2, t2_value);

    			if ((!current || dirty & /*userCart*/ 1) && t5_value !== (t5_value = (/*userCart*/ ctx[0]?.items.length > 0 && /*userCart*/ ctx[0]?.items.map(quantity).reduce(sum) === 1
    			? "item"
    			: "items") + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*userCart, formatPrice*/ 1) {
    				each_value = /*userCart*/ ctx[0].items;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if ((!current || dirty & /*userCart*/ 1) && t11_value !== (t11_value = formatPrice(/*userCart*/ ctx[0].subtotal, /*userCart*/ ctx[0].region.currency_code) + "")) set_data_dev(t11, t11_value);

    			if ((!current || dirty & /*userCart*/ 1) && t15_value !== (t15_value = (/*userCart*/ ctx[0].region
    			? formatPrice(/*userCart*/ ctx[0].shipping_total, /*userCart*/ ctx[0].region.currency_code)
    			: 0) + "")) set_data_dev(t15, t15_value);

    			if ((!current || dirty & /*userCart*/ 1) && t19_value !== (t19_value = formatPrice(/*userCart*/ ctx[0].subtotal, /*userCart*/ ctx[0].region.currency_code) + "")) set_data_dev(t19, t19_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(27:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if isLoading}
    function create_if_block$6(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Loading Your Order Summary";
    			add_location(p, file$b, 24, 4, 579);
    			add_location(div, file$b, 23, 2, 569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(23:0) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    // (43:8) {#each userCart.items as { thumbnail, variant, unit_price, quantity, title }}
    function create_each_block$4(ctx) {
    	let li;
    	let orderitempreview;
    	let t;
    	let current;

    	orderitempreview = new OrderItemPreview({
    			props: {
    				size: /*variant*/ ctx[4].title,
    				quantity: /*quantity*/ ctx[6],
    				orderThumbnail: /*thumbnail*/ ctx[3],
    				name: /*title*/ ctx[7],
    				price: formatPrice(/*unit_price*/ ctx[5], /*userCart*/ ctx[0].region.currency_code)
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(orderitempreview.$$.fragment);
    			t = space();
    			add_location(li, file$b, 43, 10, 1168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(orderitempreview, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const orderitempreview_changes = {};
    			if (dirty & /*userCart*/ 1) orderitempreview_changes.size = /*variant*/ ctx[4].title;
    			if (dirty & /*userCart*/ 1) orderitempreview_changes.quantity = /*quantity*/ ctx[6];
    			if (dirty & /*userCart*/ 1) orderitempreview_changes.orderThumbnail = /*thumbnail*/ ctx[3];
    			if (dirty & /*userCart*/ 1) orderitempreview_changes.name = /*title*/ ctx[7];
    			if (dirty & /*userCart*/ 1) orderitempreview_changes.price = formatPrice(/*unit_price*/ ctx[5], /*userCart*/ ctx[0].region.currency_code);
    			orderitempreview.$set(orderitempreview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(orderitempreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(orderitempreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(orderitempreview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(43:8) {#each userCart.items as { thumbnail, variant, unit_price, quantity, title }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLoading*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OrderSummary', slots, []);
    	let userProducts;
    	let userCart = [];
    	let isLoading = true;

    	products.subscribe(({ cartItems }) => {
    		userProducts = cartItems;
    	});

    	medusaCartState.subscribe(state => {
    		if (state.cart.items) {
    			$$invalidate(0, userCart = state.cart);
    			$$invalidate(1, isLoading = false);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OrderSummary> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		OrderItemPreview,
    		medusaCartState,
    		products,
    		formatPrice,
    		quantity,
    		sum,
    		userProducts,
    		userCart,
    		isLoading
    	});

    	$$self.$inject_state = $$props => {
    		if ('userProducts' in $$props) userProducts = $$props.userProducts;
    		if ('userCart' in $$props) $$invalidate(0, userCart = $$props.userCart);
    		if ('isLoading' in $$props) $$invalidate(1, isLoading = $$props.isLoading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [userCart, isLoading];
    }

    class OrderSummary extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OrderSummary",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    function mount(node, type, elements, dispatch, options) {
      const element = elements.create(type, options);

      element.mount(node);
      element.on('change', (e) => dispatch('change', e));
      element.on('ready', (e) => dispatch('ready', e));
      element.on('focus', (e) => dispatch('focus', e));
      element.on('blur', (e) => dispatch('blur', e));
      element.on('escape', (e) => dispatch('escape', e));
      element.on('click', (e) => dispatch('click', e));

      return element
    }

    const isServer = typeof(window) === 'undefined';

    /* node_modules/svelte-stripe-js/CardNumber.svelte generated by Svelte v3.44.1 */
    const file$a = "node_modules/svelte-stripe-js/CardNumber.svelte";

    function create_fragment$c(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$a, 41, 0, 869);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[12](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[12](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardNumber', slots, []);
    	let { classes = {} } = $$props;
    	let { style = {} } = $$props;
    	let { placeholder = 'Card number' } = $$props;
    	let { disabled = false } = $$props;
    	let { showIcon = true } = $$props;
    	let { iconStyle = 'default' } = $$props;
    	let { element = null } = $$props;
    	let wrapper;
    	const dispatch = createEventDispatcher();
    	const { elements } = getContext('stripe');

    	onMount(() => {
    		const options = {
    			classes,
    			style,
    			placeholder,
    			disabled,
    			showIcon,
    			iconStyle
    		};

    		$$invalidate(1, element = mount(wrapper, 'cardNumber', elements, dispatch, options));
    		return () => element.unmount();
    	});

    	function blur() {
    		element.blur();
    	}

    	function clear() {
    		element.clear();
    	}

    	function destroy() {
    		element.destroy();
    	}

    	function focus() {
    		element.focus();
    	}

    	const writable_props = [
    		'classes',
    		'style',
    		'placeholder',
    		'disabled',
    		'showIcon',
    		'iconStyle',
    		'element'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardNumber> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(0, wrapper);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('classes' in $$props) $$invalidate(2, classes = $$props.classes);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
    		if ('showIcon' in $$props) $$invalidate(6, showIcon = $$props.showIcon);
    		if ('iconStyle' in $$props) $$invalidate(7, iconStyle = $$props.iconStyle);
    		if ('element' in $$props) $$invalidate(1, element = $$props.element);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		createEventDispatcher,
    		mount,
    		classes,
    		style,
    		placeholder,
    		disabled,
    		showIcon,
    		iconStyle,
    		element,
    		wrapper,
    		dispatch,
    		elements,
    		blur,
    		clear,
    		destroy,
    		focus
    	});

    	$$self.$inject_state = $$props => {
    		if ('classes' in $$props) $$invalidate(2, classes = $$props.classes);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
    		if ('showIcon' in $$props) $$invalidate(6, showIcon = $$props.showIcon);
    		if ('iconStyle' in $$props) $$invalidate(7, iconStyle = $$props.iconStyle);
    		if ('element' in $$props) $$invalidate(1, element = $$props.element);
    		if ('wrapper' in $$props) $$invalidate(0, wrapper = $$props.wrapper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		wrapper,
    		element,
    		classes,
    		style,
    		placeholder,
    		disabled,
    		showIcon,
    		iconStyle,
    		blur,
    		clear,
    		destroy,
    		focus,
    		div_binding
    	];
    }

    class CardNumber extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			classes: 2,
    			style: 3,
    			placeholder: 4,
    			disabled: 5,
    			showIcon: 6,
    			iconStyle: 7,
    			element: 1,
    			blur: 8,
    			clear: 9,
    			destroy: 10,
    			focus: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardNumber",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get classes() {
    		throw new Error("<CardNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<CardNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<CardNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<CardNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showIcon() {
    		throw new Error("<CardNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showIcon(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconStyle() {
    		throw new Error("<CardNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconStyle(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<CardNumber>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[8];
    	}

    	set blur(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clear() {
    		return this.$$.ctx[9];
    	}

    	set clear(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get destroy() {
    		return this.$$.ctx[10];
    	}

    	set destroy(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[11];
    	}

    	set focus(value) {
    		throw new Error("<CardNumber>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-stripe-js/CardExpiry.svelte generated by Svelte v3.44.1 */
    const file$9 = "node_modules/svelte-stripe-js/CardExpiry.svelte";

    function create_fragment$b(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$9, 39, 0, 780);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[10](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardExpiry', slots, []);
    	let { classes = {} } = $$props;
    	let { style = {} } = $$props;
    	let { placeholder = 'MM / YY' } = $$props;
    	let { disabled = false } = $$props;
    	let { element = null } = $$props;
    	let wrapper;
    	const dispatch = createEventDispatcher();
    	const { elements } = getContext('stripe');

    	onMount(() => {
    		const options = { classes, style, placeholder, disabled };
    		$$invalidate(1, element = mount(wrapper, 'cardExpiry', elements, dispatch, options));
    		return () => element.unmount();
    	});

    	function blur() {
    		element.blur();
    	}

    	function clear() {
    		element.clear();
    	}

    	function destroy() {
    		element.destroy();
    	}

    	function focus() {
    		element.focus();
    	}

    	const writable_props = ['classes', 'style', 'placeholder', 'disabled', 'element'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardExpiry> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(0, wrapper);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('classes' in $$props) $$invalidate(2, classes = $$props.classes);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
    		if ('element' in $$props) $$invalidate(1, element = $$props.element);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		createEventDispatcher,
    		mount,
    		classes,
    		style,
    		placeholder,
    		disabled,
    		element,
    		wrapper,
    		dispatch,
    		elements,
    		blur,
    		clear,
    		destroy,
    		focus
    	});

    	$$self.$inject_state = $$props => {
    		if ('classes' in $$props) $$invalidate(2, classes = $$props.classes);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
    		if ('element' in $$props) $$invalidate(1, element = $$props.element);
    		if ('wrapper' in $$props) $$invalidate(0, wrapper = $$props.wrapper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		wrapper,
    		element,
    		classes,
    		style,
    		placeholder,
    		disabled,
    		blur,
    		clear,
    		destroy,
    		focus,
    		div_binding
    	];
    }

    class CardExpiry extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			classes: 2,
    			style: 3,
    			placeholder: 4,
    			disabled: 5,
    			element: 1,
    			blur: 6,
    			clear: 7,
    			destroy: 8,
    			focus: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardExpiry",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get classes() {
    		throw new Error("<CardExpiry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<CardExpiry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<CardExpiry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<CardExpiry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<CardExpiry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<CardExpiry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<CardExpiry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<CardExpiry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<CardExpiry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<CardExpiry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[6];
    	}

    	set blur(value) {
    		throw new Error("<CardExpiry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clear() {
    		return this.$$.ctx[7];
    	}

    	set clear(value) {
    		throw new Error("<CardExpiry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get destroy() {
    		return this.$$.ctx[8];
    	}

    	set destroy(value) {
    		throw new Error("<CardExpiry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[9];
    	}

    	set focus(value) {
    		throw new Error("<CardExpiry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-stripe-js/CardCvc.svelte generated by Svelte v3.44.1 */
    const file$8 = "node_modules/svelte-stripe-js/CardCvc.svelte";

    function create_fragment$a(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$8, 39, 0, 773);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[10](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardCvc', slots, []);
    	let { classes = {} } = $$props;
    	let { style = {} } = $$props;
    	let { placeholder = 'CVC' } = $$props;
    	let { disabled = false } = $$props;
    	let { element = null } = $$props;
    	let wrapper;
    	const dispatch = createEventDispatcher();
    	const { elements } = getContext('stripe');

    	onMount(() => {
    		const options = { classes, style, placeholder, disabled };
    		$$invalidate(1, element = mount(wrapper, 'cardCvc', elements, dispatch, options));
    		return () => element.unmount();
    	});

    	function blur() {
    		element.blur();
    	}

    	function clear() {
    		element.clear();
    	}

    	function destroy() {
    		element.destroy();
    	}

    	function focus() {
    		element.focus();
    	}

    	const writable_props = ['classes', 'style', 'placeholder', 'disabled', 'element'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardCvc> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(0, wrapper);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('classes' in $$props) $$invalidate(2, classes = $$props.classes);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
    		if ('element' in $$props) $$invalidate(1, element = $$props.element);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		createEventDispatcher,
    		mount,
    		classes,
    		style,
    		placeholder,
    		disabled,
    		element,
    		wrapper,
    		dispatch,
    		elements,
    		blur,
    		clear,
    		destroy,
    		focus
    	});

    	$$self.$inject_state = $$props => {
    		if ('classes' in $$props) $$invalidate(2, classes = $$props.classes);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
    		if ('element' in $$props) $$invalidate(1, element = $$props.element);
    		if ('wrapper' in $$props) $$invalidate(0, wrapper = $$props.wrapper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		wrapper,
    		element,
    		classes,
    		style,
    		placeholder,
    		disabled,
    		blur,
    		clear,
    		destroy,
    		focus,
    		div_binding
    	];
    }

    class CardCvc extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			classes: 2,
    			style: 3,
    			placeholder: 4,
    			disabled: 5,
    			element: 1,
    			blur: 6,
    			clear: 7,
    			destroy: 8,
    			focus: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardCvc",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get classes() {
    		throw new Error("<CardCvc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<CardCvc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<CardCvc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<CardCvc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<CardCvc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<CardCvc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<CardCvc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<CardCvc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<CardCvc>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<CardCvc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blur() {
    		return this.$$.ctx[6];
    	}

    	set blur(value) {
    		throw new Error("<CardCvc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clear() {
    		return this.$$.ctx[7];
    	}

    	set clear(value) {
    		throw new Error("<CardCvc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get destroy() {
    		return this.$$.ctx[8];
    	}

    	set destroy(value) {
    		throw new Error("<CardCvc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[9];
    	}

    	set focus(value) {
    		throw new Error("<CardCvc>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-stripe-js/Container.svelte generated by Svelte v3.44.1 */

    function create_fragment$9(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	let { stripe } = $$props;
    	const elements = isServer ? null : stripe.elements();
    	setContext('stripe', { stripe, elements });
    	const writable_props = ['stripe'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('stripe' in $$props) $$invalidate(0, stripe = $$props.stripe);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext, isServer, stripe, elements });

    	$$self.$inject_state = $$props => {
    		if ('stripe' in $$props) $$invalidate(0, stripe = $$props.stripe);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [stripe, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { stripe: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*stripe*/ ctx[0] === undefined && !('stripe' in props)) {
    			console.warn("<Container> was created without expected prop 'stripe'");
    		}
    	}

    	get stripe() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stripe(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var V3_URL = 'https://js.stripe.com/v3';
    var V3_URL_REGEX = /^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/;
    var EXISTING_SCRIPT_MESSAGE = 'loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used';
    var findScript = function findScript() {
      var scripts = document.querySelectorAll("script[src^=\"".concat(V3_URL, "\"]"));

      for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];

        if (!V3_URL_REGEX.test(script.src)) {
          continue;
        }

        return script;
      }

      return null;
    };

    var injectScript = function injectScript(params) {
      var queryString = params && !params.advancedFraudSignals ? '?advancedFraudSignals=false' : '';
      var script = document.createElement('script');
      script.src = "".concat(V3_URL).concat(queryString);
      var headOrBody = document.head || document.body;

      if (!headOrBody) {
        throw new Error('Expected document.body not to be null. Stripe.js requires a <body> element.');
      }

      headOrBody.appendChild(script);
      return script;
    };

    var registerWrapper = function registerWrapper(stripe, startTime) {
      if (!stripe || !stripe._registerWrapper) {
        return;
      }

      stripe._registerWrapper({
        name: 'stripe-js',
        version: "1.21.1",
        startTime: startTime
      });
    };

    var stripePromise$1 = null;
    var loadScript = function loadScript(params) {
      // Ensure that we only attempt to load Stripe.js at most once
      if (stripePromise$1 !== null) {
        return stripePromise$1;
      }

      stripePromise$1 = new Promise(function (resolve, reject) {
        if (typeof window === 'undefined') {
          // Resolve to null when imported server side. This makes the module
          // safe to import in an isomorphic code base.
          resolve(null);
          return;
        }

        if (window.Stripe && params) {
          console.warn(EXISTING_SCRIPT_MESSAGE);
        }

        if (window.Stripe) {
          resolve(window.Stripe);
          return;
        }

        try {
          var script = findScript();

          if (script && params) {
            console.warn(EXISTING_SCRIPT_MESSAGE);
          } else if (!script) {
            script = injectScript(params);
          }

          script.addEventListener('load', function () {
            if (window.Stripe) {
              resolve(window.Stripe);
            } else {
              reject(new Error('Stripe.js not available'));
            }
          });
          script.addEventListener('error', function () {
            reject(new Error('Failed to load Stripe.js'));
          });
        } catch (error) {
          reject(error);
          return;
        }
      });
      return stripePromise$1;
    };
    var initStripe = function initStripe(maybeStripe, args, startTime) {
      if (maybeStripe === null) {
        return null;
      }

      var stripe = maybeStripe.apply(undefined, args);
      registerWrapper(stripe, startTime);
      return stripe;
    };

    // own script injection.

    var stripePromise$1$1 = Promise.resolve().then(function () {
      return loadScript(null);
    });
    var loadCalled = false;
    stripePromise$1$1["catch"](function (err) {
      if (!loadCalled) {
        console.warn(err);
      }
    });
    var loadStripe = function loadStripe() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      loadCalled = true;
      var startTime = Date.now();
      return stripePromise$1$1.then(function (maybeStripe) {
        return initStripe(maybeStripe, args, startTime);
      });
    };

    /**
     * This is a singleton to ensure we only instantiate Stripe once.
     */

    let stripePromise;

    const getStripe = () => {
        stripePromise = loadStripe(creds?.STRIPE_KEY || "");
        return stripePromise;
    };

    /* src/components/payment-card.svelte generated by Svelte v3.44.1 */

    const { console: console_1$1 } = globals;
    const file$7 = "src/components/payment-card.svelte";

    // (62:2) {:else}
    function create_else_block$5(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				stripe: /*stripe*/ ctx[0],
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};
    			if (dirty & /*stripe*/ 1) container_changes.stripe = /*stripe*/ ctx[0];

    			if (dirty & /*$$scope, paymentStatus, paymentError, cardElement*/ 142) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(62:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:2) {#if !stripe}
    function create_if_block$5(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading Stripe ...";
    			add_location(p, file$7, 60, 4, 1363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(60:2) {#if !stripe}",
    		ctx
    	});

    	return block;
    }

    // (83:8) {#if paymentError}
    function create_if_block_2$1(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*paymentError*/ ctx[2]);
    			attr_dev(p, "class", "my-5 text-center");
    			add_location(p, file$7, 83, 10, 1907);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paymentError*/ 4) set_data_dev(t, /*paymentError*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(83:8) {#if paymentError}",
    		ctx
    	});

    	return block;
    }

    // (93:10) {:else}
    function create_else_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Make Payment");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(93:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (91:10) {#if paymentStatus === "IN_PROGRESS"}
    function create_if_block_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Making Payment...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(91:10) {#if paymentStatus === \\\"IN_PROGRESS\\\"}",
    		ctx
    	});

    	return block;
    }

    // (63:4) <Container {stripe}>
    function create_default_slot$6(ctx) {
    	let form;
    	let div0;
    	let h1;
    	let t1;
    	let div4;
    	let div1;
    	let cardnumber;
    	let updating_element;
    	let t2;
    	let div2;
    	let cardexpiry;
    	let t3;
    	let div3;
    	let cardcvc;
    	let t4;
    	let t5;
    	let button;
    	let button_disabled_value;
    	let current;
    	let mounted;
    	let dispose;

    	function cardnumber_element_binding(value) {
    		/*cardnumber_element_binding*/ ctx[6](value);
    	}

    	let cardnumber_props = {};

    	if (/*cardElement*/ ctx[1] !== void 0) {
    		cardnumber_props.element = /*cardElement*/ ctx[1];
    	}

    	cardnumber = new CardNumber({ props: cardnumber_props, $$inline: true });
    	binding_callbacks.push(() => bind$1(cardnumber, 'element', cardnumber_element_binding));
    	cardexpiry = new CardExpiry({ $$inline: true });
    	cardcvc = new CardCvc({ $$inline: true });
    	let if_block0 = /*paymentError*/ ctx[2] && create_if_block_2$1(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*paymentStatus*/ ctx[3] === "IN_PROGRESS") return create_if_block_1$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Card Details";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			create_component(cardnumber.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(cardexpiry.$$.fragment);
    			t3 = space();
    			div3 = element("div");
    			create_component(cardcvc.$$.fragment);
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			button = element("button");
    			if_block1.c();
    			attr_dev(h1, "class", "font-semibold text-1xl");
    			add_location(h1, file$7, 65, 10, 1526);
    			attr_dev(div0, "class", "mb-4");
    			add_location(div0, file$7, 64, 8, 1497);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file$7, 69, 10, 1619);
    			attr_dev(div2, "class", "mb-3");
    			add_location(div2, file$7, 73, 10, 1720);
    			attr_dev(div3, "class", "mb-3");
    			add_location(div3, file$7, 77, 10, 1794);
    			add_location(div4, file$7, 68, 8, 1603);
    			attr_dev(button, "class", "custom-btn my-5");
    			button.disabled = button_disabled_value = /*paymentStatus*/ ctx[3] === "IN_PROGRESS";
    			add_location(button, file$7, 86, 8, 1977);
    			attr_dev(form, "id", "payment-form");
    			add_location(form, file$7, 63, 6, 1430);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, h1);
    			append_dev(form, t1);
    			append_dev(form, div4);
    			append_dev(div4, div1);
    			mount_component(cardnumber, div1, null);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			mount_component(cardexpiry, div2, null);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			mount_component(cardcvc, div3, null);
    			append_dev(form, t4);
    			if (if_block0) if_block0.m(form, null);
    			append_dev(form, t5);
    			append_dev(form, button);
    			if_block1.m(button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit*/ ctx[4]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const cardnumber_changes = {};

    			if (!updating_element && dirty & /*cardElement*/ 2) {
    				updating_element = true;
    				cardnumber_changes.element = /*cardElement*/ ctx[1];
    				add_flush_callback(() => updating_element = false);
    			}

    			cardnumber.$set(cardnumber_changes);

    			if (/*paymentError*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(form, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(button, null);
    				}
    			}

    			if (!current || dirty & /*paymentStatus*/ 8 && button_disabled_value !== (button_disabled_value = /*paymentStatus*/ ctx[3] === "IN_PROGRESS")) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardnumber.$$.fragment, local);
    			transition_in(cardexpiry.$$.fragment, local);
    			transition_in(cardcvc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardnumber.$$.fragment, local);
    			transition_out(cardexpiry.$$.fragment, local);
    			transition_out(cardcvc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(cardnumber);
    			destroy_component(cardexpiry);
    			destroy_component(cardcvc);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(63:4) <Container {stripe}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*stripe*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$7, 58, 0, 1337);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Payment_card', slots, []);

    	onMount(async () => {
    		await startPaymentSession();
    	});

    	let { session } = $$props;
    	console.log(session);
    	let stripe = null;
    	let cardElement;
    	let paymentError;
    	let paymentStatus;

    	onMount(async () => {
    		$$invalidate(0, stripe = await getStripe());
    		console.log(stripe);
    	});

    	async function submit() {
    		$$invalidate(3, paymentStatus = "IN_PROGRESS");

    		try {
    			if (session.data?.client) {
    				const payload = await stripe.confirmCardPayment(session.data.client_secret, { payment_method: { card: cardElement } });

    				if (payload.error) {
    					$$invalidate(2, paymentError = payload.error.message);
    					$$invalidate(3, paymentStatus = "FAILED");
    				} else {
    					$$invalidate(3, paymentStatus = "SUCCESS");
    					navigate(`/payment`);
    				}
    			} else {
    				$$invalidate(3, paymentStatus = "FAILED");
    				$$invalidate(2, paymentError = "An Error Occurred. Unable to process your payment at the moment.");
    			}
    		} catch(e) {
    			$$invalidate(3, paymentStatus = "FAILED");
    			console.log(e);
    		}
    	}

    	const writable_props = ['session'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Payment_card> was created with unknown prop '${key}'`);
    	});

    	function cardnumber_element_binding(value) {
    		cardElement = value;
    		$$invalidate(1, cardElement);
    	}

    	$$self.$$set = $$props => {
    		if ('session' in $$props) $$invalidate(5, session = $$props.session);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		navigate,
    		CardCvc,
    		CardExpiry,
    		CardNumber,
    		Container,
    		startPaymentSession,
    		getStripe,
    		session,
    		stripe,
    		cardElement,
    		paymentError,
    		paymentStatus,
    		submit
    	});

    	$$self.$inject_state = $$props => {
    		if ('session' in $$props) $$invalidate(5, session = $$props.session);
    		if ('stripe' in $$props) $$invalidate(0, stripe = $$props.stripe);
    		if ('cardElement' in $$props) $$invalidate(1, cardElement = $$props.cardElement);
    		if ('paymentError' in $$props) $$invalidate(2, paymentError = $$props.paymentError);
    		if ('paymentStatus' in $$props) $$invalidate(3, paymentStatus = $$props.paymentStatus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		stripe,
    		cardElement,
    		paymentError,
    		paymentStatus,
    		submit,
    		session,
    		cardnumber_element_binding
    	];
    }

    class Payment_card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { session: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Payment_card",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*session*/ ctx[5] === undefined && !('session' in props)) {
    			console_1$1.warn("<Payment_card> was created without expected prop 'session'");
    		}
    	}

    	get session() {
    		throw new Error("<Payment_card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set session(value) {
    		throw new Error("<Payment_card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/checkout/paymentStep.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;

    const file$6 = "src/routes/checkout/paymentStep.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (39:2) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let current;
    	let each_value = /*userPayment*/ ctx[0].payment_sessions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(div, file$6, 39, 4, 785);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*handlePayment, userPayment*/ 5) {
    				each_value = /*userPayment*/ ctx[0].payment_sessions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(39:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#if paymentLoader}
    function create_if_block$4(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading payment";
    			add_location(p, file$6, 37, 4, 748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(37:2) {#if paymentLoader}",
    		ctx
    	});

    	return block;
    }

    // (57:8) {:else}
    function create_else_block_1(ctx) {
    	let paymentcard;
    	let current;

    	paymentcard = new Payment_card({
    			props: { session: /*session*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paymentcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paymentcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paymentcard_changes = {};
    			if (dirty & /*userPayment*/ 1) paymentcard_changes.session = /*session*/ ctx[4];
    			paymentcard.$set(paymentcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paymentcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paymentcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paymentcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(57:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#if session.provider_id === "manual"}
    function create_if_block_1$1(ctx) {
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let div1;
    	let button;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*session*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Test Payment";
    			t1 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Pay";
    			t3 = space();
    			attr_dev(h1, "class", "font-semibold text-2xl");
    			add_location(h1, file$6, 44, 14, 953);
    			attr_dev(div0, "class", "mb-6");
    			add_location(div0, file$6, 43, 12, 920);
    			attr_dev(button, "class", "custom-btn");
    			add_location(button, file$6, 48, 14, 1084);
    			set_style(div1, "text-align", "right");
    			add_location(div1, file$6, 47, 12, 1038);
    			add_location(div2, file$6, 42, 10, 902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			append_dev(div2, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(42:8) {#if session.provider_id === \\\"manual\\\"}",
    		ctx
    	});

    	return block;
    }

    // (41:6) {#each userPayment.payment_sessions as session}
    function create_each_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*session*/ ctx[4].provider_id === "manual") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(41:6) {#each userPayment.payment_sessions as session}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*paymentLoader*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			add_location(div, file$6, 35, 0, 716);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaymentStep', slots, []);
    	let userPayment = [];
    	let paymentLoader = true;

    	onMount(async () => {
    		await startPaymentSession();
    	});

    	medusaPayment.subscribe(state => {
    		if (state.cart) {
    			$$invalidate(0, userPayment = state.cart);
    			$$invalidate(1, paymentLoader = false);
    		}
    	});

    	const handlePayment = async providerId => {
    		try {
    			await setPaymentSession(providerId);
    			navigate("/payment");
    		} catch(e) {
    			console.log(e);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<PaymentStep> was created with unknown prop '${key}'`);
    	});

    	const click_handler = session => handlePayment(session.provider_id);

    	$$self.$capture_state = () => ({
    		onMount,
    		navigate,
    		PaymentCard: Payment_card,
    		medusaPayment,
    		setPaymentSession,
    		startPaymentSession,
    		userPayment,
    		paymentLoader,
    		handlePayment
    	});

    	$$self.$inject_state = $$props => {
    		if ('userPayment' in $$props) $$invalidate(0, userPayment = $$props.userPayment);
    		if ('paymentLoader' in $$props) $$invalidate(1, paymentLoader = $$props.paymentLoader);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [userPayment, paymentLoader, handlePayment, click_handler];
    }

    class PaymentStep extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaymentStep",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/routes/checkout/index.svelte generated by Svelte v3.44.1 */
    const file$5 = "src/routes/checkout/index.svelte";

    // (35:6) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let delivery;
    	let t0;
    	let t1;
    	let current;
    	delivery = new DeliveryStep({ $$inline: true });
    	let if_block0 = /*currentCheckoutState*/ ctx[0] === "Delivery" && create_if_block_2(ctx);
    	let if_block1 = /*currentCheckoutState*/ ctx[0] === "Payment" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(delivery.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "mr-5");
    			add_location(div, file$5, 35, 8, 1029);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(delivery, div, null);
    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*currentCheckoutState*/ ctx[0] === "Delivery") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*currentCheckoutState*/ ctx[0] === "Payment") {
    				if (if_block1) {
    					if (dirty & /*currentCheckoutState*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(delivery.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(delivery.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(delivery);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(35:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:6) {#if currentCheckoutState === "Information"}
    function create_if_block$3(ctx) {
    	let informationstep;
    	let current;
    	informationstep = new InformationStep({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(informationstep.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(informationstep, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(informationstep.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(informationstep.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(informationstep, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(33:6) {#if currentCheckoutState === \\\"Information\\\"}",
    		ctx
    	});

    	return block;
    }

    // (39:10) {#if currentCheckoutState === "Delivery"}
    function create_if_block_2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let svg;
    	let path;
    	let t0;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = text("\n\n                  Back to Information");
    			t1 = space();
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(path, "clip-rule", "evenodd");
    			attr_dev(path, "d", "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z");
    			attr_dev(path, "fill-rule", "evenodd");
    			add_location(path, file$5, 51, 20, 1638);
    			attr_dev(svg, "class", "h-5 w-5 mr-2 mt-1");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$5, 45, 18, 1412);
    			attr_dev(div0, "class", "flex cursor-pointer");
    			add_location(div0, file$5, 41, 16, 1251);
    			attr_dev(div1, "style", "display : flex; align-items: center");
    			add_location(div1, file$5, 40, 14, 1185);
    			attr_dev(button, "class", "custom-btn");
    			add_location(button, file$5, 62, 14, 2034);
    			attr_dev(div2, "class", "flex justify-between");
    			add_location(div2, file$5, 39, 12, 1136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(39:10) {#if currentCheckoutState === \\\"Delivery\\\"}",
    		ctx
    	});

    	return block;
    }

    // (76:10) {#if currentCheckoutState === "Payment"}
    function create_if_block_1(ctx) {
    	let payment;
    	let current;
    	payment = new PaymentStep({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(payment.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(payment, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(payment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(payment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(payment, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(76:10) {#if currentCheckoutState === \\\"Payment\\\"}",
    		ctx
    	});

    	return block;
    }

    // (27:0) <Wrapper>
    function create_default_slot$5(ctx) {
    	let nav;
    	let t0;
    	let div2;
    	let div0;
    	let checkoutstage;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let div1;
    	let ordersummary;
    	let current;

    	nav = new Nav({
    			props: { hideCartControls: true },
    			$$inline: true
    		});

    	checkoutstage = new CheckoutStage({
    			props: {
    				activeStage: /*currentCheckoutState*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentCheckoutState*/ ctx[0] === "Information") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	ordersummary = new OrderSummary({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			create_component(checkoutstage.$$.fragment);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			div1 = element("div");
    			create_component(ordersummary.$$.fragment);
    			attr_dev(div0, "class", "steps-ctn");
    			add_location(div0, file$5, 29, 4, 844);
    			attr_dev(div1, "class", "summary-ctn");
    			add_location(div1, file$5, 82, 4, 2493);
    			attr_dev(div2, "class", "checkout-container");
    			add_location(div2, file$5, 28, 2, 807);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(checkoutstage, div0, null);
    			append_dev(div0, t1);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			mount_component(ordersummary, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkoutstage_changes = {};
    			if (dirty & /*currentCheckoutState*/ 1) checkoutstage_changes.activeStage = /*currentCheckoutState*/ ctx[0];
    			checkoutstage.$set(checkoutstage_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(checkoutstage.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(ordersummary.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(checkoutstage.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(ordersummary.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(checkoutstage);
    			if_blocks[current_block_type_index].d();
    			destroy_component(ordersummary);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(27:0) <Wrapper>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let t0;
    	let t1;
    	let wrapper;
    	let current;

    	wrapper = new Wrapper({
    			props: {
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = text("Checkout");
    			t1 = space();
    			create_component(wrapper.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(wrapper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const wrapper_changes = {};

    			if (dirty & /*$$scope, currentCheckoutState*/ 33) {
    				wrapper_changes.$$scope = { dirty, ctx };
    			}

    			wrapper.$set(wrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			destroy_component(wrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkout', slots, []);
    	let currentCheckoutState;

    	checkoutStore.subscribe(state => {
    		$$invalidate(0, currentCheckoutState = state?.currentCheckoutStep);
    	});

    	let cart;
    	let deliveryOption;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Checkout> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, currentCheckoutState = "Information");

    	const click_handler_1 = () => updateCheckoutStore({
    		currentStep: "Payment",
    		hasSelectedShipping: true
    	});

    	$$self.$capture_state = () => ({
    		CheckoutStage,
    		Nav,
    		checkoutStore,
    		updateCheckoutStore,
    		Wrapper,
    		Delivery: DeliveryStep,
    		InformationStep,
    		OrderSummary,
    		Payment: PaymentStep,
    		currentCheckoutState,
    		cart,
    		deliveryOption
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentCheckoutState' in $$props) $$invalidate(0, currentCheckoutState = $$props.currentCheckoutState);
    		if ('cart' in $$props) cart = $$props.cart;
    		if ('deliveryOption' in $$props) deliveryOption = $$props.deliveryOption;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentCheckoutState, click_handler, click_handler_1];
    }

    class Checkout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkout",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/routes/product/allProducts.svelte generated by Svelte v3.44.1 */
    const file$4 = "src/routes/product/allProducts.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i].id;
    	child_ctx[3] = list[i].title;
    	child_ctx[4] = list[i].variants;
    	return child_ctx;
    }

    // (31:4) {:else}
    function create_else_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*products*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products, formatPrice*/ 1) {
    				each_value = /*products*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(31:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#if productsLoader}
    function create_if_block$2(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Loading products ...";
    			add_location(p, file$4, 28, 8, 573);
    			add_location(div, file$4, 27, 6, 559);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(27:4) {#if productsLoader}",
    		ctx
    	});

    	return block;
    }

    // (34:10) <Link style="text-decoration: none;" to={`product/${id}`}>
    function create_default_slot$4(ctx) {
    	let div;
    	let p0;
    	let t0_value = /*title*/ ctx[3] + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = formatPrice(/*variants*/ ctx[4][0].prices[0].amount, /*variants*/ ctx[4][0].prices[0].currency_code) + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			attr_dev(p0, "class", "title svelte-17mfs35");
    			add_location(p0, file$4, 35, 14, 806);
    			add_location(p1, file$4, 37, 14, 850);
    			add_location(div, file$4, 34, 12, 786);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(p1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*products*/ 1 && t0_value !== (t0_value = /*title*/ ctx[3] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*products*/ 1 && t2_value !== (t2_value = formatPrice(/*variants*/ ctx[4][0].prices[0].amount, /*variants*/ ctx[4][0].prices[0].currency_code) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(34:10) <Link style=\\\"text-decoration: none;\\\" to={`product/${id}`}>",
    		ctx
    	});

    	return block;
    }

    // (32:6) {#each products as { id, title, variants }}
    function create_each_block$2(ctx) {
    	let li;
    	let link;
    	let t;
    	let current;

    	link = new Link({
    			props: {
    				style: "text-decoration: none;",
    				to: `product/${/*id*/ ctx[2]}`,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(link.$$.fragment);
    			t = space();
    			attr_dev(li, "class", "product svelte-17mfs35");
    			add_location(li, file$4, 32, 8, 684);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*products*/ 1) link_changes.to = `product/${/*id*/ ctx[2]}`;

    			if (dirty & /*$$scope, products*/ 129) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(32:6) {#each products as { id, title, variants }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let hr;
    	let t2;
    	let ul;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*productsLoader*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Demo Products";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			ul = element("ul");
    			if_block.c();
    			attr_dev(h3, "class", "text-xl mb-5");
    			add_location(h3, file$4, 22, 2, 454);
    			add_location(hr, file$4, 23, 2, 500);
    			attr_dev(ul, "class", "my-5");
    			add_location(ul, file$4, 25, 2, 510);
    			add_location(div, file$4, 21, 0, 446);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, hr);
    			append_dev(div, t2);
    			append_dev(div, ul);
    			if_blocks[current_block_type_index].m(ul, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(ul, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AllProducts', slots, []);
    	let products;
    	let productsLoader = true;

    	medusaProductStore.subscribe(data => {
    		if (data?.allProducts[0]?.variants) {
    			$$invalidate(0, products = data.allProducts);
    			$$invalidate(1, productsLoader = false);
    		}
    	});

    	retrieveAllProducts();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AllProducts> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link,
    		medusaProductStore,
    		retrieveAllProducts,
    		formatPrice,
    		products,
    		productsLoader
    	});

    	$$self.$inject_state = $$props => {
    		if ('products' in $$props) $$invalidate(0, products = $$props.products);
    		if ('productsLoader' in $$props) $$invalidate(1, productsLoader = $$props.productsLoader);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [products, productsLoader];
    }

    class AllProducts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AllProducts",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/routes/Home.svelte generated by Svelte v3.44.1 */
    const file$3 = "src/routes/Home.svelte";

    // (13:0) <Wrapper>
    function create_default_slot$3(ctx) {
    	let nav;
    	let t0;
    	let div4;
    	let div3;
    	let section0;
    	let div0;
    	let h1;
    	let t1;
    	let t2_value = " " + "";
    	let t2;
    	let t3;
    	let span;
    	let t5;
    	let p;
    	let t7;
    	let div2;
    	let div1;
    	let t9;
    	let a0;
    	let t11;
    	let a1;
    	let t13;
    	let a2;
    	let t15;
    	let section1;
    	let a3;
    	let button0;
    	let t16;
    	let svg;
    	let path;
    	let t17;
    	let a4;
    	let button1;
    	let t19;
    	let section2;
    	let allproducts;
    	let current;
    	nav = new Nav({ $$inline: true });
    	allproducts = new AllProducts({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			section0 = element("section");
    			div0 = element("div");
    			h1 = element("h1");
    			t1 = text("Medusa + Svelte starter! ");
    			t2 = text(t2_value);
    			t3 = space();
    			span = element("span");
    			span.textContent = "🚀";
    			t5 = space();
    			p = element("p");
    			p.textContent = "Build blazing-fast client applications on top of a modular headless\n            commerce engine. Integrate seamlessly with any 3rd party tools for a\n            best-in-breed commerce stack.";
    			t7 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "v1.0.0";
    			t9 = space();
    			a0 = element("a");
    			a0.textContent = "Medusa";
    			t11 = space();
    			a1 = element("a");
    			a1.textContent = "Svelte";
    			t13 = space();
    			a2 = element("a");
    			a2.textContent = "Stripe";
    			t15 = space();
    			section1 = element("section");
    			a3 = element("a");
    			button0 = element("button");
    			t16 = text("View the docs\n\n            ");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t17 = space();
    			a4 = element("a");
    			button1 = element("button");
    			button1.textContent = "View on GitHub";
    			t19 = space();
    			section2 = element("section");
    			create_component(allproducts.$$.fragment);
    			attr_dev(span, "role", "img");
    			add_location(span, file$3, 21, 12, 519);
    			attr_dev(h1, "class", "mb-5 text-3xl font-semibold");
    			add_location(h1, file$3, 19, 10, 423);
    			add_location(p, file$3, 23, 10, 574);
    			attr_dev(div0, "class", "my-5");
    			add_location(div0, file$3, 18, 8, 394);
    			attr_dev(div1, "class", "tag-boxes mr-5");
    			set_style(div1, "background-color", "lightgrey");
    			set_style(div1, "color", "#000");
    			add_location(div1, file$3, 31, 10, 858);
    			attr_dev(a0, "class", "tag-boxes mr-5");
    			set_style(a0, "background-color", "#484f59");
    			attr_dev(a0, "href", "https://github.com/medusajs/medusa");
    			add_location(a0, file$3, 38, 10, 1018);
    			attr_dev(a1, "class", "tag-boxes mr-5");
    			set_style(a1, "background-color", "rgb(94, 58, 148)");
    			attr_dev(a1, "href", "https://github.com/sveltejs/svelte");
    			add_location(a1, file$3, 46, 10, 1214);
    			attr_dev(a2, "class", "tag-boxes mr-5");
    			set_style(a2, "background-color", "rgb(67, 121, 255)");
    			attr_dev(a2, "href", "https://stripe.com");
    			add_location(a2, file$3, 54, 10, 1419);
    			attr_dev(div2, "class", "tag-boxes-ctn");
    			add_location(div2, file$3, 30, 8, 820);
    			add_location(section0, file$3, 17, 6, 376);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M13 7l5 5m0 0l-5 5m5-5H6");
    			add_location(path, file$3, 80, 14, 2091);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 ml-2");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$3, 73, 12, 1878);
    			attr_dev(button0, "class", "custom-btn w-full");
    			add_location(button0, file$3, 70, 10, 1804);
    			attr_dev(a3, "href", "https://www.docs.medusa-commerce.com/");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener");
    			add_location(a3, file$3, 65, 8, 1675);
    			attr_dev(button1, "class", "custom-btn");
    			set_style(button1, "background", "transparent");
    			set_style(button1, "color", "#000");
    			set_style(button1, "border", "transparent");
    			set_style(button1, "width", "100%");
    			add_location(button1, file$3, 95, 10, 2473);
    			attr_dev(a4, "href", "https://github.com/medusajs/svelte-starter-medusa");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noopener");
    			add_location(a4, file$3, 90, 8, 2332);
    			attr_dev(section1, "class", "buttons-ctn");
    			add_location(section1, file$3, 64, 6, 1637);
    			add_location(section2, file$3, 104, 6, 2700);
    			add_location(div3, file$3, 16, 4, 364);
    			attr_dev(div4, "class", "home-container");
    			add_location(div4, file$3, 15, 2, 331);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, section0);
    			append_dev(section0, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, span);
    			append_dev(div0, t5);
    			append_dev(div0, p);
    			append_dev(section0, t7);
    			append_dev(section0, div2);
    			append_dev(div2, div1);
    			append_dev(div2, t9);
    			append_dev(div2, a0);
    			append_dev(div2, t11);
    			append_dev(div2, a1);
    			append_dev(div2, t13);
    			append_dev(div2, a2);
    			append_dev(div3, t15);
    			append_dev(div3, section1);
    			append_dev(section1, a3);
    			append_dev(a3, button0);
    			append_dev(button0, t16);
    			append_dev(button0, svg);
    			append_dev(svg, path);
    			append_dev(section1, t17);
    			append_dev(section1, a4);
    			append_dev(a4, button1);
    			append_dev(div3, t19);
    			append_dev(div3, section2);
    			mount_component(allproducts, section2, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(allproducts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(allproducts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div4);
    			destroy_component(allproducts);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(13:0) <Wrapper>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t;
    	let wrapper;
    	let current;

    	wrapper = new Wrapper({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t = space();
    			create_component(wrapper.$$.fragment);
    			document.title = "Svelte Medusa Starter";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			mount_component(wrapper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const wrapper_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				wrapper_changes.$$scope = { dirty, ctx };
    			}

    			wrapper.$set(wrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_component(wrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Nav, AllProducts, Wrapper });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/routes/payment/index.svelte generated by Svelte v3.44.1 */
    const file$2 = "src/routes/payment/index.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].thumbnail;
    	child_ctx[4] = list[i].title;
    	child_ctx[5] = list[i].quantity;
    	child_ctx[6] = list[i].unit_price;
    	child_ctx[7] = list[i].variant;
    	return child_ctx;
    }

    // (38:2) {:else}
    function create_else_block$1(ctx) {
    	let div6;
    	let div5;
    	let div0;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let hr0;
    	let t4;
    	let t5;
    	let hr1;
    	let t6;
    	let div4;
    	let div1;
    	let p1;
    	let t8;
    	let p2;
    	let t9_value = formatPrice(/*cartConfirmation*/ ctx[1].subtotal, /*cartConfirmation*/ ctx[1]?.region?.currency_code) + "";
    	let t9;
    	let t10;
    	let div2;
    	let p3;
    	let t12;
    	let p4;
    	let t13_value = formatPrice(/*cartConfirmation*/ ctx[1].shipping_total, /*cartConfirmation*/ ctx[1]?.region?.currency_code) + "";
    	let t13;
    	let t14;
    	let div3;
    	let p5;
    	let t16;
    	let p6;
    	let t17_value = formatPrice(/*cartConfirmation*/ ctx[1].total, /*cartConfirmation*/ ctx[1]?.region?.currency_code) + "";
    	let t17;
    	let t18;
    	let hr2;
    	let t19;
    	let p7;
    	let t20;
    	let b;
    	let t21_value = /*cartConfirmation*/ ctx[1].email + "";
    	let t21;
    	let t22;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*cartConfirmation*/ ctx[1].items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Order Summary";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Thank you for your order!";
    			t3 = space();
    			hr0 = element("hr");
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			hr1 = element("hr");
    			t6 = space();
    			div4 = element("div");
    			div1 = element("div");
    			p1 = element("p");
    			p1.textContent = "Subtotal";
    			t8 = space();
    			p2 = element("p");
    			t9 = text(t9_value);
    			t10 = space();
    			div2 = element("div");
    			p3 = element("p");
    			p3.textContent = "Shipping";
    			t12 = space();
    			p4 = element("p");
    			t13 = text(t13_value);
    			t14 = space();
    			div3 = element("div");
    			p5 = element("p");
    			p5.textContent = "Total";
    			t16 = space();
    			p6 = element("p");
    			t17 = text(t17_value);
    			t18 = space();
    			hr2 = element("hr");
    			t19 = space();
    			p7 = element("p");
    			t20 = text("An order confirmation will be sent to you at ");
    			b = element("b");
    			t21 = text(t21_value);
    			t22 = space();
    			button = element("button");
    			button.textContent = "Okay, View Existing Products";
    			attr_dev(h1, "class", "font-semibold text-4xl mb-5");
    			add_location(h1, file$2, 41, 10, 994);
    			attr_dev(p0, "class", "mb-5");
    			add_location(p0, file$2, 42, 10, 1063);
    			attr_dev(div0, "class", "my-5");
    			add_location(div0, file$2, 40, 8, 965);
    			add_location(hr0, file$2, 45, 8, 1133);
    			add_location(hr1, file$2, 62, 8, 1615);
    			add_location(p1, file$2, 66, 12, 1712);
    			add_location(p2, file$2, 67, 12, 1740);
    			attr_dev(div1, "class", "flex justify-between mb-3");
    			add_location(div1, file$2, 65, 10, 1660);
    			add_location(p3, file$2, 76, 12, 1985);
    			add_location(p4, file$2, 77, 12, 2013);
    			attr_dev(div2, "class", "flex justify-between mb-3");
    			add_location(div2, file$2, 75, 10, 1933);
    			add_location(p5, file$2, 86, 12, 2278);
    			add_location(p6, file$2, 87, 12, 2303);
    			attr_dev(div3, "class", "flex justify-between font-semibold mb-3");
    			add_location(div3, file$2, 85, 10, 2212);
    			attr_dev(div4, "class", "my-5");
    			add_location(div4, file$2, 64, 8, 1631);
    			add_location(hr2, file$2, 95, 8, 2505);
    			add_location(b, file$2, 98, 55, 2593);
    			attr_dev(p7, "class", "my-5");
    			add_location(p7, file$2, 97, 8, 2521);
    			attr_dev(button, "class", "custom-btn");
    			set_style(button, "width", "100%");
    			add_location(button, file$2, 103, 8, 2671);
    			add_location(div5, file$2, 39, 6, 951);
    			attr_dev(div6, "class", "container svelte-1t1tzwr");
    			add_location(div6, file$2, 38, 4, 921);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div5, t3);
    			append_dev(div5, hr0);
    			append_dev(div5, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			append_dev(div5, t5);
    			append_dev(div5, hr1);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, p1);
    			append_dev(div1, t8);
    			append_dev(div1, p2);
    			append_dev(p2, t9);
    			append_dev(div4, t10);
    			append_dev(div4, div2);
    			append_dev(div2, p3);
    			append_dev(div2, t12);
    			append_dev(div2, p4);
    			append_dev(p4, t13);
    			append_dev(div4, t14);
    			append_dev(div4, div3);
    			append_dev(div3, p5);
    			append_dev(div3, t16);
    			append_dev(div3, p6);
    			append_dev(p6, t17);
    			append_dev(div5, t18);
    			append_dev(div5, hr2);
    			append_dev(div5, t19);
    			append_dev(div5, p7);
    			append_dev(p7, t20);
    			append_dev(p7, b);
    			append_dev(b, t21);
    			append_dev(div5, t22);
    			append_dev(div5, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cartConfirmation, formatPrice*/ 2) {
    				each_value = /*cartConfirmation*/ ctx[1].items;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div5, t5);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if ((!current || dirty & /*cartConfirmation*/ 2) && t9_value !== (t9_value = formatPrice(/*cartConfirmation*/ ctx[1].subtotal, /*cartConfirmation*/ ctx[1]?.region?.currency_code) + "")) set_data_dev(t9, t9_value);
    			if ((!current || dirty & /*cartConfirmation*/ 2) && t13_value !== (t13_value = formatPrice(/*cartConfirmation*/ ctx[1].shipping_total, /*cartConfirmation*/ ctx[1]?.region?.currency_code) + "")) set_data_dev(t13, t13_value);
    			if ((!current || dirty & /*cartConfirmation*/ 2) && t17_value !== (t17_value = formatPrice(/*cartConfirmation*/ ctx[1].total, /*cartConfirmation*/ ctx[1]?.region?.currency_code) + "")) set_data_dev(t17, t17_value);
    			if ((!current || dirty & /*cartConfirmation*/ 2) && t21_value !== (t21_value = /*cartConfirmation*/ ctx[1].email + "")) set_data_dev(t21, t21_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(38:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:2) {#if loadingPayment}
    function create_if_block$1(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Hang on while we validate your payment...";
    			add_location(p, file$2, 35, 6, 847);
    			attr_dev(div, "class", "flex justify-center");
    			add_location(div, file$2, 34, 4, 807);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(34:2) {#if loadingPayment}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#each cartConfirmation.items as { thumbnail, title, quantity, unit_price, variant }}
    function create_each_block$1(ctx) {
    	let div;
    	let orderitempreview;
    	let current;

    	orderitempreview = new OrderItemPreview({
    			props: {
    				orderThumbnail: /*thumbnail*/ ctx[3],
    				name: "" + (/*title*/ ctx[4] + ","),
    				size: /*variant*/ ctx[7].title,
    				quantity: true,
    				price: formatPrice(/*unit_price*/ ctx[6], /*cartConfirmation*/ ctx[1]?.region?.currency_code)
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(orderitempreview.$$.fragment);
    			attr_dev(div, "class", "my-5");
    			add_location(div, file$2, 48, 10, 1245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(orderitempreview, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const orderitempreview_changes = {};
    			if (dirty & /*cartConfirmation*/ 2) orderitempreview_changes.orderThumbnail = /*thumbnail*/ ctx[3];
    			if (dirty & /*cartConfirmation*/ 2) orderitempreview_changes.name = "" + (/*title*/ ctx[4] + ",");
    			if (dirty & /*cartConfirmation*/ 2) orderitempreview_changes.size = /*variant*/ ctx[7].title;
    			if (dirty & /*cartConfirmation*/ 2) orderitempreview_changes.price = formatPrice(/*unit_price*/ ctx[6], /*cartConfirmation*/ ctx[1]?.region?.currency_code);
    			orderitempreview.$set(orderitempreview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(orderitempreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(orderitempreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(orderitempreview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(48:8) {#each cartConfirmation.items as { thumbnail, title, quantity, unit_price, variant }}",
    		ctx
    	});

    	return block;
    }

    // (31:0) <Wrapper>
    function create_default_slot$2(ctx) {
    	let nav;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	nav = new Nav({
    			props: { hideCartControls: true },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loadingPayment*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(31:0) <Wrapper>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t0;
    	let t1;
    	let wrapper;
    	let current;

    	wrapper = new Wrapper({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = text("Payment");
    			t1 = space();
    			create_component(wrapper.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(wrapper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const wrapper_changes = {};

    			if (dirty & /*$$scope, loadingPayment, cartConfirmation*/ 1027) {
    				wrapper_changes.$$scope = { dirty, ctx };
    			}

    			wrapper.$set(wrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			destroy_component(wrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Payment', slots, []);
    	let loadingPayment = true;
    	let cartConfirmation = {};

    	onMount(async () => {
    		await completeCartCheckout();
    	});

    	medusaCartConfirmation.subscribe(state => {
    		if (state.email) {
    			$$invalidate(1, cartConfirmation = state);
    			$$invalidate(0, loadingPayment = false);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Payment> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => resetCart();

    	$$self.$capture_state = () => ({
    		onMount,
    		Nav,
    		OrderItemPreview,
    		completeCartCheckout,
    		medusaCartConfirmation,
    		resetCart,
    		formatPrice,
    		Wrapper,
    		loadingPayment,
    		cartConfirmation
    	});

    	$$self.$inject_state = $$props => {
    		if ('loadingPayment' in $$props) $$invalidate(0, loadingPayment = $$props.loadingPayment);
    		if ('cartConfirmation' in $$props) $$invalidate(1, cartConfirmation = $$props.cartConfirmation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadingPayment, cartConfirmation, click_handler];
    }

    class Payment extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Payment",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/quantitySlider.svelte generated by Svelte v3.44.1 */

    const file$1 = "src/components/quantitySlider.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t2;
    	let t3;
    	let p2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "-";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(/*orderCount*/ ctx[2]);
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "+";
    			attr_dev(p0, "class", "controls mr-10 svelte-y4a1af");
    			add_location(p0, file$1, 8, 4, 172);
    			add_location(p1, file$1, 9, 4, 244);
    			attr_dev(p2, "class", "controls ml-10 svelte-y4a1af");
    			add_location(p2, file$1, 10, 4, 268);
    			attr_dev(div0, "class", "flex");
    			add_location(div0, file$1, 7, 2, 149);
    			add_location(div1, file$1, 6, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(p1, t2);
    			append_dev(div0, t3);
    			append_dev(div0, p2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(p0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(p2, "click", /*click_handler_1*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*orderCount*/ 4) set_data_dev(t2, /*orderCount*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QuantitySlider', slots, []);

    	let { increaseQuantity = function () {
    		
    	} } = $$props;

    	let { decreaseQuantity = function () {
    		
    	} } = $$props;

    	let { orderCount } = $$props;
    	const writable_props = ['increaseQuantity', 'decreaseQuantity', 'orderCount'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QuantitySlider> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => decreaseQuantity();
    	const click_handler_1 = () => increaseQuantity();

    	$$self.$$set = $$props => {
    		if ('increaseQuantity' in $$props) $$invalidate(0, increaseQuantity = $$props.increaseQuantity);
    		if ('decreaseQuantity' in $$props) $$invalidate(1, decreaseQuantity = $$props.decreaseQuantity);
    		if ('orderCount' in $$props) $$invalidate(2, orderCount = $$props.orderCount);
    	};

    	$$self.$capture_state = () => ({
    		increaseQuantity,
    		decreaseQuantity,
    		orderCount
    	});

    	$$self.$inject_state = $$props => {
    		if ('increaseQuantity' in $$props) $$invalidate(0, increaseQuantity = $$props.increaseQuantity);
    		if ('decreaseQuantity' in $$props) $$invalidate(1, decreaseQuantity = $$props.decreaseQuantity);
    		if ('orderCount' in $$props) $$invalidate(2, orderCount = $$props.orderCount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [increaseQuantity, decreaseQuantity, orderCount, click_handler, click_handler_1];
    }

    class QuantitySlider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			increaseQuantity: 0,
    			decreaseQuantity: 1,
    			orderCount: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuantitySlider",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*orderCount*/ ctx[2] === undefined && !('orderCount' in props)) {
    			console.warn("<QuantitySlider> was created without expected prop 'orderCount'");
    		}
    	}

    	get increaseQuantity() {
    		throw new Error("<QuantitySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set increaseQuantity(value) {
    		throw new Error("<QuantitySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get decreaseQuantity() {
    		throw new Error("<QuantitySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set decreaseQuantity(value) {
    		throw new Error("<QuantitySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orderCount() {
    		throw new Error("<QuantitySlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orderCount(value) {
    		throw new Error("<QuantitySlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/product/productPage.svelte generated by Svelte v3.44.1 */
    const file = "src/routes/product/productPage.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import Nav from "../../components/Nav.svelte";   import QuantitySlider from "../../components/quantitySlider.svelte";   import { addVariantToCart }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   import Nav from \\\"../../components/Nav.svelte\\\";   import QuantitySlider from \\\"../../components/quantitySlider.svelte\\\";   import { addVariantToCart }",
    		ctx
    	});

    	return block;
    }

    // (56:27)      {#if !productData}
    function create_then_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*productData*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(56:27)      {#if !productData}",
    		ctx
    	});

    	return block;
    }

    // (59:4) {:else}
    function create_else_block(ctx) {
    	let div9;
    	let figure;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div8;
    	let div7;
    	let div1;
    	let h2;
    	let t1_value = /*productData*/ ctx[0].title + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3_value = formatPrices(/*productData*/ ctx[0], /*productData*/ ctx[0].variants[0]) + "";
    	let t3;
    	let t4;
    	let br0;
    	let t5;
    	let div3;
    	let p1;
    	let t7;
    	let div2;
    	let t8;
    	let br1;
    	let t9;
    	let div4;
    	let p2;
    	let t11;
    	let quantityslider;
    	let t12;
    	let div5;
    	let button;
    	let t13;
    	let svg;
    	let path;
    	let t14;
    	let div6;
    	let p3;
    	let t16;
    	let p4;
    	let t17_value = /*productData*/ ctx[0].description + "";
    	let t17;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*productData*/ ctx[0].variants;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	quantityslider = new QuantitySlider({
    			props: {
    				orderCount: /*orderCount*/ ctx[1],
    				increaseQuantity: /*func*/ ctx[8],
    				decreaseQuantity: /*func_1*/ ctx[9]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			figure = element("figure");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div1 = element("div");
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			div3 = element("div");
    			p1 = element("p");
    			p1.textContent = "Select Size";
    			t7 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			br1 = element("br");
    			t9 = space();
    			div4 = element("div");
    			p2 = element("p");
    			p2.textContent = "Select Quantity";
    			t11 = space();
    			create_component(quantityslider.$$.fragment);
    			t12 = space();
    			div5 = element("div");
    			button = element("button");
    			t13 = text("Add To Bag\n                ");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t14 = space();
    			div6 = element("div");
    			p3 = element("p");
    			p3.textContent = "Product Description";
    			t16 = space();
    			p4 = element("p");
    			t17 = text(t17_value);
    			attr_dev(img, "class", "product-img");
    			attr_dev(img, "alt", "product");
    			if (!src_url_equal(img.src, img_src_value = /*productData*/ ctx[0].thumbnail)) attr_dev(img, "src", img_src_value);
    			add_location(img, file, 62, 12, 1508);
    			attr_dev(div0, "class", "imgPlaceholder");
    			add_location(div0, file, 61, 10, 1467);
    			add_location(figure, file, 60, 8, 1448);
    			attr_dev(h2, "class", "font-semibold text-2xl");
    			add_location(h2, file, 73, 14, 1769);
    			add_location(p0, file, 76, 14, 1875);
    			add_location(div1, file, 72, 12, 1749);
    			add_location(br0, file, 80, 12, 1998);
    			attr_dev(p1, "class", "mb-4");
    			add_location(p1, file, 82, 14, 2037);
    			attr_dev(div2, "class", "flex");
    			add_location(div2, file, 84, 14, 2084);
    			add_location(div3, file, 81, 12, 2017);
    			add_location(br1, file, 102, 12, 2852);
    			attr_dev(p2, "class", "mb-4");
    			add_location(p2, file, 105, 14, 2905);
    			attr_dev(div4, "class", "mb-5");
    			add_location(div4, file, 104, 12, 2872);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z");
    			add_location(path, file, 130, 18, 3688);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 ml-3");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file, 123, 16, 3447);
    			attr_dev(button, "class", "custom-btn");
    			add_location(button, file, 115, 14, 3190);
    			attr_dev(div5, "class", "mb-7");
    			add_location(div5, file, 114, 12, 3157);
    			attr_dev(p3, "class", "mb-4 text-lg");
    			add_location(p3, file, 141, 14, 4005);
    			add_location(p4, file, 142, 14, 4067);
    			add_location(div6, file, 140, 12, 3985);
    			add_location(div7, file, 71, 10, 1731);
    			attr_dev(div8, "class", "ml-10 mt-5 flex justify-center");
    			add_location(div8, file, 70, 8, 1676);
    			attr_dev(div9, "class", "product-ctn");
    			add_location(div9, file, 59, 6, 1414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, figure);
    			append_dev(figure, div0);
    			append_dev(div0, img);
    			append_dev(div9, t0);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(div7, t4);
    			append_dev(div7, br0);
    			append_dev(div7, t5);
    			append_dev(div7, div3);
    			append_dev(div3, p1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div7, t8);
    			append_dev(div7, br1);
    			append_dev(div7, t9);
    			append_dev(div7, div4);
    			append_dev(div4, p2);
    			append_dev(div4, t11);
    			mount_component(quantityslider, div4, null);
    			append_dev(div7, t12);
    			append_dev(div7, div5);
    			append_dev(div5, button);
    			append_dev(button, t13);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, p3);
    			append_dev(div6, t16);
    			append_dev(div6, p4);
    			append_dev(p4, t17);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*productData*/ 1 && !src_url_equal(img.src, img_src_value = /*productData*/ ctx[0].thumbnail)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*productData*/ 1) && t1_value !== (t1_value = /*productData*/ ctx[0].title + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*productData*/ 1) && t3_value !== (t3_value = formatPrices(/*productData*/ ctx[0], /*productData*/ ctx[0].variants[0]) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*selectedVariantSize, productData*/ 5) {
    				each_value = /*productData*/ ctx[0].variants;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const quantityslider_changes = {};
    			if (dirty & /*orderCount*/ 2) quantityslider_changes.orderCount = /*orderCount*/ ctx[1];
    			quantityslider.$set(quantityslider_changes);
    			if ((!current || dirty & /*productData*/ 1) && t17_value !== (t17_value = /*productData*/ ctx[0].description + "")) set_data_dev(t17, t17_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quantityslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quantityslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_each(each_blocks, detaching);
    			destroy_component(quantityslider);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(59:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (57:4) {#if !productData}
    function create_if_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading product ...";
    			add_location(p, file, 57, 6, 1369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(57:4) {#if !productData}",
    		ctx
    	});

    	return block;
    }

    // (86:16) {#each productData.variants as variant}
    function create_each_block(ctx) {
    	let div;
    	let t0_value = /*variant*/ ctx[13].title + "";
    	let t0;
    	let t1;
    	let div_style_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*variant*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "size-box");

    			attr_dev(div, "style", div_style_value = `color: ${/*selectedVariantSize*/ ctx[2] === /*variant*/ ctx[13].title && "#fff"};
                                                background: ${/*selectedVariantSize*/ ctx[2] === /*variant*/ ctx[13].title && "lightgrey"}`);

    			add_location(div, file, 86, 18, 2177);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*productData*/ 1 && t0_value !== (t0_value = /*variant*/ ctx[13].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*selectedVariantSize, productData*/ 5 && div_style_value !== (div_style_value = `color: ${/*selectedVariantSize*/ ctx[2] === /*variant*/ ctx[13].title && "#fff"};
                                                background: ${/*selectedVariantSize*/ ctx[2] === /*variant*/ ctx[13].title && "lightgrey"}`)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(86:16) {#each productData.variants as variant}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import Nav from "../../components/Nav.svelte";   import QuantitySlider from "../../components/quantitySlider.svelte";   import { addVariantToCart }
    function create_pending_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script>   import Nav from \\\"../../components/Nav.svelte\\\";   import QuantitySlider from \\\"../../components/quantitySlider.svelte\\\";   import { addVariantToCart }",
    		ctx
    	});

    	return block;
    }

    // (54:0) <Wrapper>
    function create_default_slot$1(ctx) {
    	let nav;
    	let t;
    	let await_block_anchor;
    	let current;
    	nav = new Nav({ $$inline: true });

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 12,
    		blocks: [,,,]
    	};

    	handle_promise(/*preload*/ ctx[4](), info);

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    			t = space();
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(54:0) <Wrapper>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let t1;
    	let wrapper;
    	let current;

    	wrapper = new Wrapper({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t0 = text("Product");
    			t1 = space();
    			create_component(wrapper.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(wrapper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const wrapper_changes = {};

    			if (dirty & /*$$scope, productData, selectedVariant, orderCount, selectedVariantSize*/ 65551) {
    				wrapper_changes.$$scope = { dirty, ctx };
    			}

    			wrapper.$set(wrapper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wrapper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wrapper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			destroy_component(wrapper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductPage', slots, []);
    	let productData;
    	let orderCount = 1;
    	let selectedVariantSize = "S";
    	let selectedVariant;

    	async function preload() {
    		const productId = getRouteParam(window.location.href, 4);

    		medusaProductStore.subscribe(item => {
    			$$invalidate(0, productData = item.product);

    			if (item.product) {
    				getCurrentVariantPrice(item.product);
    			}
    		});

    		await retrieveProduct(productId);
    	}

    	const removeOrder = () => {
    		if (orderCount > 1) {
    			$$invalidate(1, orderCount = orderCount - 1);
    		}
    	};

    	const addOrder = () => {
    		$$invalidate(1, orderCount = orderCount + 1);
    	};

    	const getCurrentVariantPrice = product => {
    		if (product.variants) {
    			$$invalidate(3, selectedVariant = product.variants.find(({ title }) => title === selectedVariantSize));
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductPage> was created with unknown prop '${key}'`);
    	});

    	const click_handler = variant => $$invalidate(2, selectedVariantSize = variant.title);
    	const func = () => addOrder();
    	const func_1 = () => removeOrder();

    	const click_handler_1 = () => {
    		addVariantToCart(selectedVariant.id, orderCount);
    		$$invalidate(1, orderCount = 1);
    	};

    	$$self.$capture_state = () => ({
    		Nav,
    		QuantitySlider,
    		addVariantToCart,
    		medusaProductStore,
    		retrieveProduct,
    		formatPrices,
    		getRouteParam,
    		Wrapper,
    		productData,
    		orderCount,
    		selectedVariantSize,
    		selectedVariant,
    		preload,
    		removeOrder,
    		addOrder,
    		getCurrentVariantPrice
    	});

    	$$self.$inject_state = $$props => {
    		if ('productData' in $$props) $$invalidate(0, productData = $$props.productData);
    		if ('orderCount' in $$props) $$invalidate(1, orderCount = $$props.orderCount);
    		if ('selectedVariantSize' in $$props) $$invalidate(2, selectedVariantSize = $$props.selectedVariantSize);
    		if ('selectedVariant' in $$props) $$invalidate(3, selectedVariant = $$props.selectedVariant);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		productData,
    		orderCount,
    		selectedVariantSize,
    		selectedVariant,
    		preload,
    		removeOrder,
    		addOrder,
    		click_handler,
    		func,
    		func_1,
    		click_handler_1
    	];
    }

    class ProductPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductPage",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */

    // (21:0) <Router {url}>
    function create_default_slot(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let current;

    	route0 = new Route({
    			props: { component: Home, path: "/" },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { component: Checkout, path: "/checkout" },
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				component: ProductPage,
    				path: "/product/:productId"
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: { component: Payment, path: "/payment" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(route3, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(route3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(21:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t = space();
    			create_component(router.$$.fragment);
    			document.title = "Svelte Medusa Starter";
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(() => {
    		handleStoreCart();
    	});

    	let { url = "" } = $$props;
    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Route,
    		Router,
    		Checkout,
    		Home,
    		Payment,
    		ProductPage,
    		handleStoreCart,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
