(function() {
  var $, $$, Keys, SimpleSelectListView, View, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  _ = require('underscore-plus');

  Keys = {
    Escape: 27,
    Enter: 13,
    Tab: 9
  };

  SimpleSelectListView = (function(_super) {
    __extends(SimpleSelectListView, _super);

    function SimpleSelectListView() {
      this.confirmSelection = __bind(this.confirmSelection, this);
      this.selectNextItemView = __bind(this.selectNextItemView, this);
      this.selectPreviousItemView = __bind(this.selectPreviousItemView, this);
      return SimpleSelectListView.__super__.constructor.apply(this, arguments);
    }

    SimpleSelectListView.prototype.maxItems = 10;

    SimpleSelectListView.content = function() {
      return this.div({
        "class": "select-list popover-list"
      }, (function(_this) {
        return function() {
          _this.input({
            "class": "hidden-input",
            outlet: "hiddenInput"
          });
          return _this.ol({
            "class": "list-group",
            outlet: "list"
          });
        };
      })(this));
    };

    SimpleSelectListView.prototype.initialize = function() {
      this.list.on("mousedown", "li", (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          return _this.selectItemView($(e.target).closest("li"));
        };
      })(this));
      return this.list.on("mouseup", "li", (function(_this) {
        return function(e) {
          e.preventDefault();
          e.stopPropagation();
          if ($(e.target).closest("li").hasClass("selected")) {
            return _this.confirmSelection();
          }
        };
      })(this));
    };

    SimpleSelectListView.prototype.selectPreviousItemView = function() {
      var view;
      view = this.getSelectedItemView().prev();
      if (!view.length) {
        view = this.list.find("li:last");
      }
      this.selectItemView(view);
      return false;
    };

    SimpleSelectListView.prototype.selectNextItemView = function() {
      var view;
      view = this.getSelectedItemView().next();
      if (!view.length) {
        view = this.list.find("li:first");
      }
      this.selectItemView(view);
      return false;
    };

    SimpleSelectListView.prototype.setItems = function(items) {
      if (items == null) {
        items = [];
      }
      this.items = items;
      return this.populateList();
    };

    SimpleSelectListView.prototype.selectItemView = function(view) {
      if (!view.length) {
        return;
      }
      this.list.find(".selected").removeClass("selected");
      view.addClass("selected");
      return this.scrollToItemView(view);
    };

    SimpleSelectListView.prototype.scrollToItemView = function(view) {
      var desiredBottom, desiredTop, scrollTop;
      scrollTop = this.list.scrollTop();
      desiredTop = view.position().top + scrollTop;
      desiredBottom = desiredTop + view.outerHeight();
      if (desiredTop < scrollTop) {
        return this.list.scrollTop(desiredTop);
      } else {
        return this.list.scrollBottom(desiredBottom);
      }
    };

    SimpleSelectListView.prototype.getSelectedItemView = function() {
      return this.list.find("li.selected");
    };

    SimpleSelectListView.prototype.getSelectedItem = function() {
      return this.getSelectedItemView().data("select-list-item");
    };

    SimpleSelectListView.prototype.confirmSelection = function() {
      var item;
      item = this.getSelectedItem();
      if (item != null) {
        return this.confirmed(item);
      } else {
        return this.cancel();
      }
    };

    SimpleSelectListView.prototype.attached = function() {
      this.active = true;
      return this.hiddenInput.focus();
    };

    SimpleSelectListView.prototype.populateList = function() {
      var i, item, itemView, _i, _ref1;
      if (this.items == null) {
        return;
      }
      this.list.empty();
      for (i = _i = 0, _ref1 = Math.min(this.items.length, this.maxItems); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        item = this.items[i];
        itemView = this.viewForItem(item);
        $(itemView).data("select-list-item", item);
        this.list.append(itemView);
      }
      return this.selectItemView(this.list.find("li:first"));
    };

    SimpleSelectListView.prototype.viewForItem = function(_arg) {
      var word;
      word = _arg.word;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            return _this.span(word);
          };
        })(this));
      });
    };

    SimpleSelectListView.prototype.cancel = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.list.empty();
      return this.detach();
    };

    return SimpleSelectListView;

  })(View);

  module.exports = SimpleSelectListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBZ0IsT0FBQSxDQUFRLHNCQUFSLENBQWhCLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsWUFBQSxJQUFSLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLEVBQVI7QUFBQSxJQUNBLEtBQUEsRUFBTyxFQURQO0FBQUEsSUFFQSxHQUFBLEVBQUssQ0FGTDtHQUpGLENBQUE7O0FBQUEsRUFRTTtBQUNKLDJDQUFBLENBQUE7Ozs7Ozs7S0FBQTs7QUFBQSxtQ0FBQSxRQUFBLEdBQVUsRUFBVixDQUFBOztBQUFBLElBQ0Esb0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDBCQUFQO09BQUwsRUFBd0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN0QyxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxZQUFBLE9BQUEsRUFBTyxjQUFQO0FBQUEsWUFBdUIsTUFBQSxFQUFRLGFBQS9CO1dBQVAsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE9BQUEsRUFBTyxZQUFQO0FBQUEsWUFBcUIsTUFBQSxFQUFRLE1BQTdCO1dBQUosRUFGc0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QyxFQURRO0lBQUEsQ0FEVixDQUFBOztBQUFBLG1DQU9BLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFHVixNQUFBLElBQUMsQ0FBQSxJQUFJLENB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
//# sourceURL=/c:/Users/LesanceDtAY/.atom/packages/autocomplete-plus/lib/simple-select-list-view.coffee