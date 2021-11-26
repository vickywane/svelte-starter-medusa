<p align="center">
  <a href="https://www.medusa-commerce.com">
    <img alt="Medusa" src="https://user-images.githubusercontent.com/7554214/129161578-19b83dc8-fac5-4520-bd48-53cba676edd2.png" width="100" />
  </a>
   
   <a href="https://svelte.dev" >
   <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg" alt="svelte" style="height: 12vh; object-fit: contain" />
   </a>
</p>
<h1 align="center">
  Medusa Svelte Starter
</h1>
<p align="center">
Medusa is an open-source headless commerce engine that enables developers to create amazing digital commerce experiences.
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

> **Prerequisites**: To use the starter you should have a Medusa server running locally on port 9000. Check out [medusa-starter-default](https://github.com/medusajs/medusa-starter-default) for a quick setup.

## Quick start

1. **Setting up the environment**

   Navigate into your projects directory and create a `creds.js` file in the root directory using our template;

   ```shell
   cd medusa-svelte-starter/
   mv creds.template.js creds.js
   ```
   
   If you are using [Stripe](https://stripe.com/), add your Stripe API key to the `creds.js` file using the format below.

   ```js
   export const STRIPE_KEY='pk_test_something'
   ```

   > **Note**: The `creds.js` file has been included in the `.gitignore` file, hence, it will not be included in your version control.

2. **Install dependencies**

   Use Yarn to install all dependencies.

   ```shell
   yarn install
   ```

3. **Start developing.**

   Start up the local development server.

   ```bash
   yarn dev
   ```

4. **Open the code and start customizing!**

   Your site is now running at http://localhost:8000!

   Edit the `src/routes/Home.svelte` file to see your site update in real-time!

5. **Learn more about Medusa**

    - [Website](https://www.medusa-commerce.com/)
    - [GitHub](https://github.com/medusajs)
    - [Documentation](https://docs.medusa-commerce.com/)

6. **Learn more about [Svelte](https://svelte.dev/)**

    - [Documentation](https://svelte.dev/docs)

    - [Tutorials](https://svelte.dev/examples#hello-world)
