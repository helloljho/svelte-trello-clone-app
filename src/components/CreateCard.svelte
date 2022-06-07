<script>
  import { tick } from "svelte";
  import { autoFocusout } from "~/actions/autoFocusout";
  import { cards } from "~/store/list";

  export let listId;

  let isEditMode = false;
  let title = "";
  let textareaEl;

  function addCard() {
    if (title.trim()) {
      cards.add({
        listId,
        title,
      });
    }
    offEditMode();
  }
  async function onEditeMode() {
    isEditMode = true;
    title = "";
    await tick();
    textareaEl && textareaEl.focus();
  }
  function offEditMode() {
    isEditMode = false;
  }
</script>

{#if isEditMode}
  <div class="edit-mode" use:autoFocusout={offEditMode}>
    <textarea
      bind:value={title}
      bind:this={textareaEl}
      placeholder="Enter a title for this card..."
      on:keydown={(event) => {
        event.key === "Enter" && addCard();
        event.key === "Escape" && offEditMode();
        event.key === "Esc" && offEditMode();
      }}
    />
    <div class="actions">
      <button class="btn success" on:click={addCard}>Add card</button>
      <button class="btn" on:click={offEditMode}>Cancel card</button>
    </div>
  </div>
{:else}
  <div class="add-another-card" on:click={onEditeMode}>+ Add another card</div>
{/if}

<style lang="scss">
  .add-another-card {
    padding: 4px 8px;
    font-size: 14px;
    color: #5e6c84;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background: rgba(9, 30, 66, 0.08);
      color: #172b4d;
    }
  }
</style>
