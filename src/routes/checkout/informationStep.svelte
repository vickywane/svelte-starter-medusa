<script>
  import { ErrorMessage, Field, Form } from "svelte-forms-lib";
  import * as Yup from "yup";
  import { addCartInfo, medusaCartState } from "../../state/cartStore";
  import { checkoutStore } from "../../state/checkoutStore";
  import { retrieveAllProducts } from '../../state/productStore'
  let informationLoader = true;
  let cart;
  let currentCheckoutState;

  checkoutStore.subscribe((state) => {
    currentCheckoutState = state?.currentCheckoutStep;
  });
  let country_code;

  medusaCartState.subscribe((state) => {
    retrieveAllProducts;
    cart = state.cart;
    if (state.cart.region) {
      // select a default country
      country_code = state.cart.region.countries[0].iso_2;

      informationLoader = false;
    }
  });

  let Schema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "First name is too short")
      .max(50, "First name is too long")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "Last name is too short")
      .max(50, "Last name is too long")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    address: Yup.string()
      .required("Required")
      .max(45, "Address limit is 45 characters"),
    address2: Yup.string()
      .nullable(true)
      .max(45, "Address limit is 45 characters"),
    postalCode: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    province: Yup.string().nullable(true),
    phoneNo: Yup.string().required("Required"),
  });
</script>

<Form
  validationSchema={Schema}
  initialValues={{
    address: "",
    firstName: "",
    lastName: "",
    city: "",
    country: "",
    postalCode: "",
    phoneNo: "",
    email: "",
    address2: "",
  }}
  onSubmit={async ({
    address,
    address2,
    firstName,
    lastName,
    phoneNo,
    postalCode,
    email,
    city,
  }) => {
    try {
      await addCartInfo(
        {
          address_1: address,
          address_2: address2,
          city,
          country_code: country_code,
          first_name: firstName,
          last_name: lastName,
          phone: phoneNo,
          postal_code: postalCode,
        },
        email
      );
    } catch (e) {
      console.log(e);
    }
  }}
>
  <h2 class="font-semibold text-2xl mb-5 mt-5 ml-2">Address</h2>

  <div class="mb-2 m-2">
    <Field
      class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      id="firstName"
      placeholder="First Name"
      type="text"
      name="firstName"
    />

    <ErrorMessage name="firstName" />
  </div>

  <div class="mb-2 m-2">
    <Field
      class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      name="lastName"
      placeholder="Last Name"
      type="text"
    />

    <ErrorMessage name="lastName" />
  </div>

  <div class="mb-2 m-2">
    <Field
      class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      name="email"
      placeholder="Email"
      type="email"
    />
    <ErrorMessage name="email" />
  </div>

  <div class="mb-2 m-2">
    <Field
      class="shadow appearance-none border
                 border-grey-500 rounded
                 w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      name="address"
      placeholder="Address 1"
      type="text"
    />

    <ErrorMessage name="address" />
  </div>

  <div class="mb-2 m-2">
    <Field
      class="shadow appearance-none
                        border border-grey-500
                        rounded w-full py-2 px-3
                        text-gray-700 mb-3 leading-tight
                        focus:outline-none focus:shadow-outline"
      name="address2"
      placeholder="Address 2 (Optional)"
      type="text"
    />

    <ErrorMessage name="address2" />
  </div>

  <div class="mb-2 m-2">
    {#if informationLoader}
      <p>Loading available countries</p>
    {:else}
      <select
        bind:value={country_code}
        on:change={({ target }) => (country_code = target.value)}
        class="cursor-pointer
                     mb-2 shadow appearance-none
                      border border-grey-500 rounded
                      w-full py-2 px-3 text-gray-700
                      mb-3 leading-tight focus:outline-none
                      focus:shadow-outline "
        name="country"
      >
        {#each cart.region.countries as { display_name, iso_2 }}
          <option value={iso_2}>
            {display_name}
          </option>
        {/each}
      </select>
    {/if}
  </div>

  <div class="flex flex-wrap m-2mb-2">
    <div class="w-full md:w-1/2 px-2 mb-3 md:mb-0">
      <Field
        class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        name="postalCode"
        placeholder="Postal Code"
        type="number"
      />

      <ErrorMessage name="postalCode" />
    </div>
    <div class="w-full md:w-1/2 px-2">
      <Field
        class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        name="city"
        placeholder="City"
        type="text"
      />

      <ErrorMessage name="city" />
    </div>
  </div>

  <div class="mb-2 m-2">
    <Field
      class="shadow appearance-none border border-grey-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      name="phoneNo"
      placeholder="Phone"
      type="number"
    />

    <ErrorMessage name="phoneNo" />
  </div>

  <button type="submit" class="custom-btn mb-2 m-2"> Next</button>
</Form>

<style>
  :global(.select-field) {
    width: 100%;
    height: 40px;
  }
</style>
