<script>
  import Nav from "../components/Nav.svelte";
  import "../styles/component.css";
  import "../styles/home-style.css";
  import AllProducts from "./product/allProducts.svelte";
  import Wrapper from "./wrapper.svelte";
</script>

<svelte:head>
  <title>Svelte Medusa Starter</title>
</svelte:head>

<Wrapper>
  <Nav />

  <div class="home-container">
    <div>
      <section>
        <div class="my-5">
          <h1 class="mb-5 text-3xl font-semibold">
            Medusa + Svelte starter! {" "}
            <span role="img"> 🚀 </span>
          </h1>
          <p>
            Build blazing-fast client applications on top of a modular headless
            commerce engine. Integrate seamlessly with any 3rd party tools for a
            best-in-breed commerce stack.
          </p>
        </div>

        <div class="tag-boxes-ctn">
          <div
            class="tag-boxes mr-5"
            style="background-color: lightgrey; color: #000"
          >
            v1.0.0
          </div>

          <a
            class="tag-boxes mr-5"
            style="background-color: #484f59;"
            href="https://github.com/medusajs/medusa"
          >
            Medusa
          </a>

          <a
            class="tag-boxes mr-5"
            style="background-color: rgb(94, 58, 148);"
            href="https://github.com/sveltejs/svelte"
          >
            Svelte
          </a>

          <a
            class="tag-boxes mr-5"
            style="background-color: rgb(67, 121, 255);"
            href="https://stripe.com"
          >
            Stripe
          </a>
        </div>
      </section>

      <section class="buttons-ctn">
        <a
          href="https://docs.medusajs.com"
          target="_blank"
          rel="noopener"
        >
          <button class="custom-btn w-full">
            View the docs

            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </a>

        <a
          href="https://github.com/vickywane/svelte-starter-medusa"
          target="_blank"
          rel="noopener"
        >
          <button
            class="custom-btn"
            style="background: transparent; color: #000; border: transparent; width: 100%;"
          >
            View on GitHub
          </button>
        </a>
      </section>

      <section>
        <AllProducts />
      </section>
    </div>
  </div>
</Wrapper>
