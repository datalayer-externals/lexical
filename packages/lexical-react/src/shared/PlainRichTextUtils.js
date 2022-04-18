/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {EditorState, LexicalEditor} from 'lexical';

import {$createParagraphNode, $getRoot, $getSelection} from 'lexical';

export type InitialEditorStateType =
  | null
  | (() => void)
  | $ReadOnly<{
      editorState: EditorState,
      ignoreSelection?: boolean,
    }>;

const historyMergeTag: $ReadOnly<{tag: 'history-merge'}> = {
  tag: 'history-merge',
};
const editorUpdateOptions = {...historyMergeTag};

export function initializeEditor(
  editor: LexicalEditor,
  initialEditorState?: InitialEditorStateType,
): void {
  if (initialEditorState === null) {
    return;
  } else if (initialEditorState === undefined) {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if (firstChild === null) {
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        const activeElement = document.activeElement;
        if (
          $getSelection() !== null ||
          (activeElement !== null && activeElement === editor.getRootElement())
        ) {
          paragraph.select();
        }
      }
    }, editorUpdateOptions);
  } else if (initialEditorState !== null) {
    switch (typeof initialEditorState) {
      case 'object': {
        if (typeof initialEditorState === 'string') {
          const {editorState, ignoreSelection} = initialEditorState;
          const parsedEditorState = editor.parseEditorState(editorState);
          editor.setEditorState(parsedEditorState, {
            ignoreSelection,
            ...historyMergeTag,
          });
        } else {
          const {editorState, ignoreSelection} = initialEditorState;
          editor.setEditorState(editorState, {
            ignoreSelection,
            ...historyMergeTag,
          });
        }
        break;
      }
      case 'function': {
        editor.update(initialEditorState, editorUpdateOptions);
        break;
      }
    }
  }
}
