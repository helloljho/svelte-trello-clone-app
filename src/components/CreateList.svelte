<script>
  import { lists } from "~/store/list";
  import { tick } from "svelte";

  let isEditMode = false;
  let title = "";
  let textareaEl;

  function addList() {
    if (title.trim()) {
      lists.add({
        title,
      });
      offEditeMode();
    }
  }

  async function onEditeMode() {
    isEditMode = true;
    await tick();
    textareaEl && textareaEl.focus();
  }

  function offEditeMode() {
    isEditMode = false;
    title = "";
  }
</script>

<div class="create-list">
  {#if isEditMode}
    <div class="edit-mode">
      <textarea
        bind:value={title}
        bind:this={textareaEl}
        on:keydown={(event) => {
          event.key === "Enter" && addList();
          event.key === "Escape" && offEditeMode();
          event.key === "Esc" && offEditeMode();
        }}
        placeholder="Enter a title for this list ..."
      />
      <div class="actions">
        <div on:click={addList} class="btn success">Add List</div>
        <div on:click={offEditeMode} class="btn">Cancel</div>
      </div>
    </div>
  {:else}
    <div on:click={onEditeMode} class="add-another-list">
      + Add another list
    </div>
  {/if}
</div>

<style lang="scss">
  .create-list {
    white-space: normal;
    font-size: 16px;
    display: inline-block;
    width: 250px;
    padding: 10px 8px;
    vertical-align: top;
    background: rgba(#ebecf0, 0.6);
    border-radius: 4px;
    margin: 0 4px;
    line-height: 20px;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background: #ebecf0;
    }
  }
</style>
