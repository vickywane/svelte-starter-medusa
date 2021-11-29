<script>
  import Nav from "../../components/Nav.svelte";
  import QuantitySlider from "../../components/quantitySlider.svelte";
  import { addVariantToCart } from "../../state/cartStore";
  import {
    medusaProductStore,
    retrieveProduct,
  } from "../../state/productStore";
  import "../../styles/component.css";
  import "../../styles/product-detail.css";
  import { formatPrices, getRouteParam } from "../../utils/helpers";
  import Wrapper from "../wrapper.svelte";

  let productData;
  let orderCount = 1;
  let selectedVariantSize = "S";
  let selectedVariant;

  async function preload() {
    const productId = getRouteParam(window.location.href, 4);

    medusaProductStore.subscribe((item) => {
      productData = item.product;

      if (item.product) {
        getCurrentVariantPrice(item.product);
      }
    });

    await retrieveProduct(productId);
  }

  const removeOrder = () => {
    if (orderCount > 1) {
      orderCount = orderCount - 1;
    }
  };

  const addOrder = () => {
    orderCount = orderCount + 1;
  };

  const getCurrentVariantPrice = (product) => {
    if (product.variants) {
      selectedVariant = product.variants.find(
        ({ title }) => title === selectedVariantSize
      );
    }
  };
</script>

<svelte:head>Product</svelte:head>

<Wrapper>
  <Nav />
  {#await preload() then _}
    {#if !productData}
      <p>Loading product ...</p>
    {:else}
      <div class="product-ctn">
        <figure>
          <div class="imgPlaceholder">
            <img
              class="product-img"
              alt="product"
              src={productData.thumbnail}
            />
          </div>
        </figure>

        <div class="ml-10 mt-5 flex justify-center">
          <div>
            <div>
              <h2 class="font-semibold text-2xl">
                {productData.title}
              </h2>
              <p>
                {formatPrices(productData, productData.variants[0])}
              </p>
            </div>
            <br />
            <div>
              <p class="mb-4">Select Size</p>

              <div class="flex">
                {#each productData.variants as variant}
                  <div
                    class="size-box"
                    on:click={() => {
                      selectedVariantSize = variant.title;
                      selectedVariant = variant;
                    }}
                    style={`color: ${
                      selectedVariantSize === variant.title && "#fff"
                    };
                                                background: ${
                                                  selectedVariantSize ===
                                                    variant.title && "lightgrey"
                                                }`}
                  >
                    {variant.title}
                  </div>
                {/each}
              </div>
            </div>
            <br />

            <div class="mb-5">
              <p class="mb-4">Select Quantity</p>

              <QuantitySlider
                {orderCount}
                increaseQuantity={() => addOrder()}
                decreaseQuantity={() => removeOrder()}
              />
            </div>

            <div class="mb-7">
              <button
                class="custom-btn"
                on:click={() => {
                  addVariantToCart(selectedVariant.id, orderCount);
                  orderCount = 1;
                }}
              >
                Add To Bag
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 ml-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </button>
            </div>

            <div>
              <p class="mb-4 text-lg">Product Description</p>
              <p>{productData.description}</p>
            </div>
          </div>
        </div>
      </div>
    {/if}
  {/await}
</Wrapper>
