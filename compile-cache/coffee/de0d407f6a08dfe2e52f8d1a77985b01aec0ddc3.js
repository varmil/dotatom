(function() {
  var JapaneseWrapManager;

  JapaneseWrapManager = require('./japanese-wrap-manager');

  module.exports = {
    japaneseWrapManager: null,
    config: {
      characterWidth: {
        type: 'object',
        properties: {
          greekAndCoptic: {
            title: 'ギリシャ文字及びコプト文字の幅',
            type: 'integer',
            "default": 2,
            minimum: 1,
            maximum: 2
          },
          cyrillic: {
            title: 'キリル文字の幅',
            type: 'integer',
            "default": 2,
            minimum: 1,
            maximum: 2
          }
        }
      },
      lineBreakingRule: {
        type: 'object',
        properties: {
          japanese: {
            title: '日本語禁則処理を行う',
            type: 'boolean',
            "default": true
          },
          halfwidthKatakana: {
            title: '半角カタカナ(JIS X 0201 片仮名図形文字集合)を禁則処理に含める',
            type: 'boolean',
            "default": true
          },
          ideographicSpaceAsWihteSpace: {
            title: '和文間隔(U+3000)を空白文字に含める',
            type: 'boolean',
            "default": false
          }
        }
      }
    },
    activate: function(state) {
      this.japaneseWrapManager = new JapaneseWrapManager;
      return atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          var editor;
          editor = editorView.getEditor();
          return _this.japaneseWrapManager.overwriteFindWrapColumn(editor.displayBuffer);
        };
      })(this));
    },
    deactivate: function() {
      return atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          var editor;
          editor = editorView.getEditor();
          return _this.japaneseWrapManager.restoreFindWrapColumn(editor.displayBuffer);
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBQXRCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxtQkFBQSxFQUFxQixJQUFyQjtBQUFBLElBRUEsTUFBQSxFQWFFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxVQUFBLEVBQ0U7QUFBQSxVQUFBLGNBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsWUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFlBRUEsU0FBQSxFQUFTLENBRlQ7QUFBQSxZQUdBLE9BQUEsRUFBUyxDQUhUO0FBQUEsWUFJQSxPQUFBLEVBQVMsQ0FKVDtXQURGO0FBQUEsVUFNQSxRQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxTQUFQO0FBQUEsWUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFlBRUEsU0FBQSxFQUFTLENBRlQ7QUFBQSxZQUdBLE9BQUEsRUFBUyxDQUhUO0FBQUEsWUFJQSxPQUFBLEVBQVMsQ0FKVDtXQVBGO1NBRkY7T0FERjtBQUFBLE1Ba0JBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxVQUFBLEVBQ0U7QUFBQSxVQUFBLFFBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLFlBQVA7QUFBQSxZQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsWUFFQSxTQUFBLEVBQVMsSUFGVDtXQURGO0FBQUEsVUFJQSxpQkFBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sdUNBQVA7QUFBQSxZQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsWUFFQSxTQUFBLEVBQVMsSUFGVDtXQUxGO0FBQUEsVUFRQSw0QkFBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sdUJBQVA7QUFBQSxZQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsWUFFQSxTQUFBLEVBQVMsS0FGVDtXQVRGO1NBRkY7T0FuQkY7S0FmRjtBQUFBLElBaURBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCLEdBQUEsQ0FBQSxtQkFBdkIsQ0FBQTthQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBbkIsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsVUFBRCxHQUFBO0FBQ2hDLGNBQUEsTUFBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLFVBQVUsQ0FBQyxTQUFYLENBQUEsQ0FBVCxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxtQkFBbUIsQ0FBQyx1QkFBckIsQ0FBNkMsTUFBTSxDQUFDLGFBQXBELEVBRmdDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsRUFGUTtJQUFBLENBakRWO0FBQUEsSUF1REEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBbkIsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsVUFBRCxHQUFBO0FBQ2hDLGNBQUEsTUFBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLFVBQVUsQ0FBQyxTQUFYLENBQUEsQ0FBVCxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxxQkFBckIsQ0FBMkMsTUFBTSxDQUFDLGFBQWxELEVBRmdDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsRUFEVTtJQUFBLENBdkRaO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/c:/Users/LesanceDtAY/.atom/packages/japanese-wrap/lib/japanese-wrap.coffee