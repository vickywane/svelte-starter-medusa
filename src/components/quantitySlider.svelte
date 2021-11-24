<script>
    export let increaseQuantity = function () {}
    export let decreaseQuantity = function () {}
    export let orderCount;
</script>

<style>
    .controls {
        color: darkgrey;
        transition: all 250ms;
        font-size: 1.1em;
    }

    .controls:hover {
        cursor: pointer;
        color: #000;
    }
</style>

<div>

    <div class="flex" >
        <p class="controls mr-10" on:click={() => decreaseQuantity()} > - </p>
        <p> {orderCount} </p>
        <p class="controls ml-10" on:click={() => increaseQuantity()} > + </p>
    </div>
</div>
