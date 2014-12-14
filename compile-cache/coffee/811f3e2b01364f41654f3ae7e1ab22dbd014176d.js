(function() {
  var $, $$, AutocompleteView, CompositeDisposable, Editor, FuzzyProvider, Range, SimpleSelectListView, Utils, minimatch, path, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Editor = _ref.Editor, Range = _ref.Range;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, $$ = _ref1.$$;

  _ = require('underscore-plus');

  path = require('path');

  minimatch = require('minimatch');

  SimpleSelectListView = require('./simple-select-list-view');

  FuzzyProvider = require('./fuzzy-provider');

  Utils = require('./utils');

  module.exports = AutocompleteView = (function(_super) {
    __extends(AutocompleteView, _super);

    function AutocompleteView() {
      this.onChanged = __bind(this.onChanged, this);
      this.onSaved = __bind(this.onSaved, this);
      this.editorHasFocus = __bind(this.editorHasFocus, this);
      this.cursorMoved = __bind(this.cursorMoved, this);
      this.contentsModified = __bind(this.contentsModified, this);
      this.runAutocompletion = __bind(this.runAutocompletion, this);
      this.cancel = __bind(this.cancel, this);
      return AutocompleteView.__super__.constructor.apply(this, arguments);
    }

    AutocompleteView.prototype.currentBuffer = null;

    AutocompleteView.prototype.debug = false;

    AutocompleteView.prototype.originalCursorPosition = null;

    AutocompleteView.prototype.initialize = function(editor) {
      this.editor = editor;
      this.editorView = atom.views.getView(this.editor);
      this.compositeDisposable = new CompositeDisposable;
      AutocompleteView.__super__.initialize.apply(this, arguments);
      this.addClass("autocomplete-plus");
      this.providers = [];
      if (this.currentFileBlacklisted()) {
        return;
      }
      this.registerProvider(new FuzzyProvider(this.editor));
      this.handleEvents();
      this.setCurrentBuffer(this.editor.getBuffer());
      this.compositeDisposable.add(atom.commands.add('atom-text-editor', {
        "autocomplete-plus:activate": this.runAutocompletion
      }));
      return this.compositeDisposable.add(atom.commands.add('.autocomplete-plus', {
        "autocomplete-plus:confirm": this.confirmSelection,
        "autocomplete-plus:select-next": this.selectNextItemView,
        "autocomplete-plus:select-previous": this.selectPreviousItemView,
        "autocomplete-plus:cancel": this.cancel
      }));
    };

    AutocompleteView.prototype.currentFileBlacklisted = function() {
      var blacklist, blacklistGlob, fileName, _i, _len;
      blacklist = (atom.config.get("autocomplete-plus.fileBlacklist") || "").split(",").map(function(s) {
        return s.trim();
      });
      fileName = path.basename(this.editor.getBuffer().getPath());
      for (_i = 0, _len = blacklist.length; _i < _len; _i++) {
        blacklistGlob = blacklist[_i];
        if (minimatch(fileName, blacklistGlob)) {
          return true;
        }
      }
      return false;
    };

    AutocompleteView.prototype.viewForItem = function(_arg) {
      var className, item, label, renderLabelAsHtml, word;
      word = _arg.word, label = _arg.label, renderLabelAsHtml = _arg.renderLabelAsHtml, className = _arg.className;
      item = $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.span(word, {
              "class": "word"
            });
            if (label != null) {
              return _this.span(label, {
                "class": "label"
              });
            }
          };
        })(this));
      });
      if (renderLabelAsHtml) {
        item.find(".label").html(label);
      }
      if (className != null) {
        item.addClass(className);
      }
      return item;
    };

    AutocompleteView.prototype.escapeHtml = function(string) {
      var escapedString;
      escapedString = string.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return escapedString;
    };

    AutocompleteView.prototype.handleEvents = function() {
      this.compositeDisposable.add(this.editor.onDidChangeCursorPosition(this.cursorMoved));
      this.compositeDisposable.add(this.editor.onDidChangeTitle(this.cancel));
      this.list.on("mousewheel", function(event) {
        return event.stopPropagation();
      });
      this.hiddenInput.on('compositionstart', (function(_this) {
        return function() {
          _this.compositionInProgress = true;
          return null;
        };
      })(this));
      return this.hiddenInput.on('compositionend', (function(_this) {
        return function() {
          _this.compositionInProgress = false;
          return null;
        };
      })(this));
    };

    AutocompleteView.prototype.registerProvider = function(provider) {
      if (_.findWhere(this.providers, provider) == null) {
        this.providers.push(provider);
        if (provider.dispose != null) {
          return this.compositeDisposable.add(provider);
        }
      }
    };

    AutocompleteView.prototype.unregisterProvider = function(provider) {
      _.remove(this.providers, provider);
      return this.compositeDisposable.remove(provider);
    };

    AutocompleteView.prototype.confirmed = function(match) {
      var replace, _ref2, _ref3;
      if ((match != null ? match.provider : void 0) == null) {
        return;
      }
      if (this.editor == null) {
        return;
      }
      replace = match.provider.confirm(match);
      if (!replace) {
        return;
      }
      if ((_ref2 = this.editor.getSelections()) != null) {
        _ref2.forEach(function(selection) {
          return selection != null ? selection.clear() : void 0;
        });
      }
      this.cancel();
      this.replaceTextWithMatch(match);
      return (_ref3 = this.editor.getCursors()) != null ? _ref3.forEach(function(cursor) {
        var position;
        position = cursor != null ? cursor.getBufferPosition() : void 0;
        if (position != null) {
          return cursor.setBufferPosition([position.row, position.column]);
        }
      }) : void 0;
    };

    AutocompleteView.prototype.cancel = function() {
      var _ref2;
      if (!this.active) {
        return;
      }
      if ((_ref2 = this.overlayDecoration) != null) {
        _ref2.destroy();
      }
      this.overlayDecoration = void 0;
      AutocompleteView.__super__.cancel.apply(this, arguments);
      if (!this.editorView.hasFocus()) {
        return this.editorView.focus();
      }
    };

    AutocompleteView.prototype.runAutocompletion = function() {
      var buffer, marker, options, provider, providerSuggestions, suggestions, _i, _len, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (this.compositionInProgress) {
        return;
      }
      this.cancel();
      this.originalSelectionBufferRanges = this.editor.getSelections().map(function(selection) {
        return selection.getBufferRange();
      });
      this.originalCursorPosition = this.editor.getCursorScreenPosition();
      if (this.originalCursorPosition == null) {
        return;
      }
      buffer = (_ref2 = this.editor) != null ? _ref2.getBuffer() : void 0;
      if (buffer == null) {
        return;
      }
      options = {
        path: buffer.getPath(),
        text: buffer.getText(),
        pos: this.originalCursorPosition
      };
      suggestions = [];
      _ref5 = (_ref3 = this.providers) != null ? (_ref4 = _ref3.slice()) != null ? _ref4.reverse() : void 0 : void 0;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        provider = _ref5[_i];
        providerSuggestions = provider != null ? provider.buildSuggestions(options) : void 0;
        if (!(providerSuggestions != null ? providerSuggestions.length : void 0)) {
          continue;
        }
        if (provider.exclusive) {
          suggestions = providerSuggestions;
          break;
        } else {
          suggestions = suggestions.concat(providerSuggestions);
        }
      }
      if (!(suggestions != null ? suggestions.length : void 0)) {
        return this.cancel();
      }
      this.setItems(suggestions);
      if (this.overlayDecoration == null) {
        marker = (_ref6 = this.editor.getLastCursor()) != null ? _ref6.getMarker() : void 0;
        return this.overlayDecoration = (_ref7 = this.editor) != null ? _ref7.decorateMarker(marker, {
          type: 'overlay',
          item: this
        }) : void 0;
      }
    };

    AutocompleteView.prototype.contentsModified = function() {
      var delay;
      delay = parseInt(atom.config.get("autocomplete-plus.autoActivationDelay"));
      if (this.delayTimeout) {
        clearTimeout(this.delayTimeout);
      }
      return this.delayTimeout = setTimeout(this.runAutocompletion, delay);
    };

    AutocompleteView.prototype.cursorMoved = function(data) {
      if (!data.textChanged) {
        return this.cancel();
      }
    };

    AutocompleteView.prototype.editorHasFocus = function() {
      var editorView;
      editorView = this.editorView;
      if (editorView.jquery) {
        editorView = editorView[0];
      }
      return editorView.hasFocus();
    };

    AutocompleteView.prototype.onSaved = function() {
      if (!this.editorHasFocus()) {
        return;
      }
      return this.cancel();
    };

    AutocompleteView.prototype.onChanged = function(e) {
      if (!this.editorHasFocus()) {
        return;
      }
      if (atom.config.get("autocomplete-plus.enableAutoActivation") && (e.newText.trim().length === 1 || e.oldText.trim().length === 1)) {
        return this.contentsModified();
      } else {
        return this.cancel();
      }
    };

    AutocompleteView.prototype.replaceTextWithMatch = function(match) {
      var buffer, newSelectedBufferRanges, selections;
      if (this.editor == null) {
        return;
      }
      newSelectedBufferRanges = [];
      buffer = this.editor.getBuffer();
      if (buffer == null) {
        return;
      }
      selections = this.editor.getSelections();
      if (selections == null) {
        return;
      }
      selections.forEach((function(_this) {
        return function(selection, i) {
          var cursorPosition, infixLength, startPosition, _ref2, _ref3, _ref4;
          if (selection != null) {
            startPosition = (_ref2 = selection.getBufferRange()) != null ? _ref2.start : void 0;
            selection.deleteSelectedText();
            cursorPosition = (_ref3 = _this.editor.getCursors()) != null ? (_ref4 = _ref3[i]) != null ? _ref4.getBufferPosition() : void 0 : void 0;
            buffer["delete"](Range.fromPointWithDelta(cursorPosition, 0, -match.prefix.length));
            infixLength = match.word.length - match.prefix.length;
            return newSelectedBufferRanges.push([startPosition, [startPosition.row, startPosition.column + infixLength]]);
          }
        };
      })(this));
      this.editor.insertText(match.word);
      return this.editor.setSelectedBufferRanges(newSelectedBufferRanges);
    };

    AutocompleteView.prototype.afterAttach = function(onDom) {
      var widestCompletion;
      if (!onDom) {
        return;
      }
      widestCompletion = parseInt(this.css("min-width")) || 0;
      this.list.querySelector("li").each(function() {
        var labelWidth, totalWidth, wordWidth;
        wordWidth = $(this).querySelector("span.word").outerWidth();
        labelWidth = $(this).querySelector("span.label").outerWidth();
        totalWidth = wordWidth + labelWidth + 40;
        return widestCompletion = Math.max(widestCompletion, totalWidth);
      });
      this.list.width(widestCompletion);
      return this.width(this.list.outerWidth());
    };

    AutocompleteView.prototype.populateList = function() {
      return AutocompleteView.__super__.populateList.apply(this, arguments);
    };

    AutocompleteView.prototype.setCurrentBuffer = function(currentBuffer) {
      this.currentBuffer = currentBuffer;
      this.compositeDisposable.add(this.currentBuffer.onDidSave(this.onSaved));
      return this.compositeDisposable.add(this.currentBuffer.onDidChange(this.onChanged));
    };

    AutocompleteView.prototype.getModel = function() {
      return null;
    };

    AutocompleteView.prototype.dispose = function() {
      return this.compositeDisposable.dispose();
    };

    return AutocompleteView;

  })(SimpleSelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBbUIsT0FBQSxDQUFRLE1BQVIsQ0FBbkIsRUFBQyxjQUFBLE1BQUQsRUFBUyxhQUFBLEtBQVQsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBRUEsUUFBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFVBQUEsQ0FBRCxFQUFJLFdBQUEsRUFGSixDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUhKLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FKUCxDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBTFosQ0FBQTs7QUFBQSxFQU1BLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSwyQkFBUixDQU52QixDQUFBOztBQUFBLEVBT0EsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FQaEIsQ0FBQTs7QUFBQSxFQVFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQVJSLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osdUNBQUEsQ0FBQTs7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSwrQkFBQSxhQUFBLEdBQWUsSUFBZixDQUFBOztBQUFBLCtCQUNBLEtBQUEsR0FBTyxLQURQLENBQUE7O0FBQUEsK0JBRUEsc0JBQUEsR0FBd0IsSUFGeEIsQ0FBQTs7QUFBQSwrQkFRQSxVQUFBLEdBQVksU0FBRSxNQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxTQUFBLE1BQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJLENBQUMsS0FBSyxD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
//# sourceURL=/c:/Users/LesanceDtAY/.atom/packages/autocomplete-plus/lib/autocomplete-view.coffee