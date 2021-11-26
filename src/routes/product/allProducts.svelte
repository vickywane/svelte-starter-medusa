<script>
  import { Link } from "svelte-routing";
  import {
    medusaProductStore,
    retrieveAllProducts,
  } from "../../state/productStore";
  import { formatPrice } from "../../utils/helpers";

  let products;
  let productsLoader = true;

  medusaProductStore.subscribe((data) => {
    if (data?.allProducts[0]?.variants) {
      products = data.allProducts;
      productsLoader = false;
    }
  });

  retrieveAllProducts();
</script>

<div>
  <h3 class="text-xl mb-5">Demo Products</h3>
  <hr />

  <ul class="my-5">
    {#if productsLoader}
      <div>
        <p>Loading products ...</p>
      </div>
    {:else}
      {#each products as { id, title, variants }}
        <li class="product">
          <Link style="text-decoration: none;" to={`product/${id}`}>
            <div>
              <p class="title">{title}</p>

              <p>
                {formatPrice(
                  variants[0].prices[0].amount,
                  variants[0].prices[0].currency_code
                )}
              </p>
            </div>
          </Link>
        </li>
      {/each}
    {/if}
  </ul>
</div>

<style>
  .product {
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    height: 9vh;
    width: 10rem;
    padding: 1rem;
    display: flex;
    transition: all 250ms;
    align-items: center;
    justify-content: center;
  }

  .product:hover {
    border: 1px solid #000;
    cursor: pointer;
  }

  .title {
    font-size: 1.1rem;
    font-weight: 600;
  }
</style>
