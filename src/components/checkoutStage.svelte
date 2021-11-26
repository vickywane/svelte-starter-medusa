<script>
  export let activeStage;

  const stages = ["Information", " / ", "Delivery", " / ", "Payment"];
</script>

<div class="flex">
  {#each stages as stage}
    <p
      class="mx-1"
      style={`color: ${activeStage === stage ? "black" : "grey"}`}
    >
      {stage}
    </p>
  {/each}
</div>
