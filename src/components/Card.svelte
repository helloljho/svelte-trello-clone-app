<script>
  import { tick } from "svelte";
  import { autoFocusout } from "~/actions/autoFocusout";

  export let card;

  let isEditeMode = false;
  let title = "";
  let textareaEl;

  function saveCard() {}
  function removeCard() {}
  async function onEditeMode() {
    isEditeMode = true;
    title = card.title;
    await tick();
    textareaEl && textareaEl.focus();
  }
  function offEditeMode() {
    isEditeMode = false;
  }
</script>

<div class="card">
  {#if isEditeMode}
    <div use:autoFocusout={offEditeMode} class="edit-mode">
      <textarea
        bind:value={title}
        bind:this={textareaEl}
        placeholder="Enter a title for this card..."
        on:keydown={(event) => {
          event.key === "Enter" && saveCard();
          event.key === "Escape" && offEditeMode();
          event.key === "Esc" && offEditeMode();
        }}
      />
      <div class="actions">
        <button class="btn success" on:click={saveCard}>Save</button>
        <button class="btn " on:click={offEditeMode}>Cancel</button>
        <button class="btn danger" on:click={removeCard}>Delete</button>
      </div>
    </div>
  {:else}
    <div class="title">
      {card.title}
      <button class="btn small" on:click={onEditeMode}>Edit</button>
    </div>
  {/if}
</div>

<style lang="scss">
  .card {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 1px;
    }
    .title {
      background: #fff;
      padding: 6px 8px;
      border-radius: 4px;
      box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
      line-height: 20px;
      position: relative;
      &:hover {
        background: #f5f5f5;
      }
      .btn {
        position: absolute;
        top: 6px;
        right: 8px;
        display: none;
      }
      &:hover .btn {
        display: block;
      }
    }
  }
</style>
