(function() {
  var AutocompleteView, Provider, Suggestion, deprecate, _;

  _ = require('underscore-plus');

  AutocompleteView = require('./autocomplete-view');

  Provider = require('./provider');

  Suggestion = require('./suggestion');

  deprecate = require('grim').deprecate;

  module.exports = {
    config: {
      includeCompletionsFromAllBuffers: {
        type: "boolean",
        "default": false
      },
      fileBlacklist: {
        type: "string",
        "default": ".*, *.md"
      },
      enableAutoActivation: {
        type: "boolean",
        "default": true
      },
      autoActivationDelay: {
        type: "integer",
        "default": 100
      }
    },
    autocompleteViews: [],
    editorSubscription: null,
    activate: function() {
      return this.editorSubscription = atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var autocompleteView;
          autocompleteView = new AutocompleteView(editor);
          editor.onDidDestroy(function() {
            if (!autocompleteView.hasParent()) {
              autocompleteView.remove();
            }
            autocompleteView.dispose();
            return _.remove(_this.autocompleteViews, autocompleteView);
          });
          return _this.autocompleteViews.push(autocompleteView);
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.editorSubscription) != null) {
        _ref.dispose();
      }
      this.editorSubscription = null;
      this.autocompleteViews.forEach(function(autocompleteView) {
        return autocompleteView.remove();
      });
      return this.autocompleteViews = [];
    },
    registerProviderForEditorView: function(provider, editorView) {
      deprecate('Use of editorView is deprecated, use registerProviderForEditor instead');
      return this.registerProviderForEditor(provider, editorView.getModel());
    },
    registerProviderForEditor: function(provider, editor) {
      var autocompleteView;
      if (provider == null) {
        return;
      }
      if (editor == null) {
        return;
      }
      autocompleteView = _.findWhere(this.autocompleteViews, {
        editor: editor
      });
      if (autocompleteView == null) {
        throw new Error("Could not register provider", provider.constructor.name);
      }
      return autocompleteView.registerProvider(provider);
    },
    unregisterProvider: function(provider) {
      var view, _i, _len, _ref, _results;
      _ref = this.autocompleteViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        _results.push(view.unregisterProvider(provider));
      }
      return _results;
    },
    Provider: Provider,
    Suggestion: Suggestion
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVIsQ0FEbkIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FIYixDQUFBOztBQUFBLEVBSUMsWUFBYSxPQUFBLENBQVEsTUFBUixFQUFiLFNBSkQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsZ0NBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BREY7QUFBQSxNQUdBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxVQURUO09BSkY7QUFBQSxNQU1BLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQVBGO0FBQUEsTUFTQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEdBRFQ7T0FWRjtLQURGO0FBQUEsSUFjQSxpQkFBQSxFQUFtQixFQWRuQjtBQUFBLElBZUEsa0JBQUEsRUFBb0IsSUFmcEI7QUFBQSxJQWtCQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMs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
//# sourceURL=/c:/Users/LesanceDtAY/.atom/packages/autocomplete-plus/lib/autocomplete.coffee