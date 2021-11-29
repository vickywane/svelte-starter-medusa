<script>
  export let name;
  export let orderThumbnail;
  export let size;
  export let price;
  export let quantity;
</script>

<div class="product-ctn">
  <div style="display: flex">
    <img class="cart-image" alt="Cart item" src={orderThumbnail} />

    <ul class="ml-5">
      <li>
        <p>{name}</p>
      </li>
      <li>
        <p class="sub-text">Size: {size}</p>
      </li>
      <li>
        <p class="sub-text">Price: {price}</p>
      </li>
      <li>
        <p class="sub-text">Quantity: {quantity}</p>
      </li>
    </ul>
  </div>
</div>

<style>
  li {
    margin: 1rem 0;
  }

  ul {
    list-style: none;
  }

  .sub-text {
    font-size: 0.9rem;
    color: #454b54;
    text-transform: capitalize;
  }

  .cart-image {
    object-fit: contain;
    height: 180px;
  }
</style>
