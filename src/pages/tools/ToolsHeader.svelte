<script>
  export let children;
  export let navigate;
</script>

<header>
  <h1>{@render children()}</h1>
  <a href="/tools" on:click|preventDefault={() => navigate("/tools")}
    >All tools</a
  >
</header>

<style>
  header {
    display: flex;
    align-items: baseline;
  }
  h1 {
    flex: 1;
  }
</style>
