(function() {
  var CharacterRegexpUtil, JapaneseWrapManager, UnicodeUtil;

  UnicodeUtil = require("./unicode-util");

  CharacterRegexpUtil = require("./character-regexp-util");

  module.exports = JapaneseWrapManager = (function() {
    JapaneseWrapManager.characterClasses = require("./character-classes");

    function JapaneseWrapManager() {
      var configName, configNameList, name, _i, _len;
      this.setupCharRegexp();
      configNameList = ['characterWidth.greekAndCoptic', 'characterWidth.cyrillic', 'lineBreakingRule.halfwidthKatakana', 'lineBreakingRule.ideographicSpaceAsWihteSpace'];
      for (_i = 0, _len = configNameList.length; _i < _len; _i++) {
        name = configNameList[_i];
        configName = 'japanese-wrap.' + name;
        atom.config.observe(configName, (function(_this) {
          return function(newValue) {
            return _this.setupCharRegexp();
          };
        })(this));
      }
      this.lineBreakingRuleJapanese = atom.config.get('japanese-wrap.lineBreakingRule.japanese');
      atom.config.observe('japanese-wrap.lineBreakingRule.japanese', (function(_this) {
        return function(newValue) {
          return _this.lineBreakingRuleJapanese = newValue;
        };
      })(this));
    }

    JapaneseWrapManager.prototype.setupCharRegexp = function() {
      var cyrillic_size, greek_size, halfWidthCharList, hankaku, notEndingCharList, notStartingCharList;
      if (atom.config.get('japanese-wrap.lineBreakingRule.ideographicSpaceAsWihteSpace')) {
        this.whitespaceCharRegexp = /\s/;
      } else {
        this.whitespaceCharRegexp = /[\t\n\v\f\r \u00a0\u2000-\u200b\u2028\u2029]/;
      }
      hankaku = atom.config.get('japanese-wrap.lineBreakingRule.halfwidthKatakana');
      greek_size = atom.config.get('japanese-wrap.characterWidth.greekAndCoptic');
      cyrillic_size = atom.config.get('japanese-wrap.characterWidth.cyrillic');
      this.wordCharRegexp = CharacterRegexpUtil.string2regexp(JapaneseWrapManager.characterClasses["Western characters"]);
      notStartingCharList = [JapaneseWrapManager.characterClasses["Closing brackets"], JapaneseWrapManager.characterClasses["Hyphens"], JapaneseWrapManager.characterClasses["Dividing punctuation marks"], JapaneseWrapManager.characterClasses["Middle dots"], JapaneseWrapManager.characterClasses["Full stops"], JapaneseWrapManager.characterClasses["Commas"], JapaneseWrapManager.characterClasses["Iteration marks"], JapaneseWrapManager.characterClasses["Prolonged sound mark"], JapaneseWrapManager.characterClasses["Small kana"], CharacterRegexpUtil.range2string(UnicodeUtil.lowSurrogateRange)];
      if (hankaku) {
        notStartingCharList.push(JapaneseWrapManager.characterClasses["Closing brackets HANKAKU"], JapaneseWrapManager.characterClasses["Middle dots HANKAKU"], JapaneseWrapManager.characterClasses["Full stops HANKAKU"], JapaneseWrapManager.characterClasses["Commas HANKAKU"], JapaneseWrapManager.characterClasses["Prolonged sound mark HANKAKU"], JapaneseWrapManager.characterClasses["Small kana HANKAKU"]);
      }
      this.notStartingCharRexgep = CharacterRegexpUtil.string2regexp.apply(CharacterRegexpUtil, notStartingCharList);
      notEndingCharList = [JapaneseWrapManager.characterClasses["Opening brackets"], CharacterRegexpUtil.range2string(UnicodeUtil.highSurrogateRange)];
      if (hankaku) {
        notEndingCharList.push(JapaneseWrapManager.characterClasses["Opening brackets HANKAKU"]);
      }
      this.notEndingCharRegexp = CharacterRegexpUtil.string2regexp.apply(CharacterRegexpUtil, notEndingCharList);
      this.zeroWidthCharRegexp = CharacterRegexpUtil.string2regexp("\\u200B-\\u200F", CharacterRegexpUtil.range2string(UnicodeUtil.lowSurrogateRange), "\\uFEFF", CharacterRegexpUtil.range2string.apply(CharacterRegexpUtil, UnicodeUtil.getRangeListByName("Combining")), "゙゚");
      halfWidthCharList = [CharacterRegexpUtil.range2string.apply(CharacterRegexpUtil, UnicodeUtil.getRangeListByName("Latin")), "\\u2000-\\u200A", "\\u2122", "\\uFF61-\\uFFDC"];
      if (greek_size === 1) {
        halfWidthCharList.push(CharacterRegexpUtil.range2string.apply(CharacterRegexpUtil, UnicodeUtil.getRangeListByName("Greek")));
      }
      if (cyrillic_size === 1) {
        halfWidthCharList.push(CharacterRegexpUtil.range2string.apply(CharacterRegexpUtil, UnicodeUtil.getRangeListByName("Cyrillic")));
      }
      return this.halfWidthCharRegexp = CharacterRegexpUtil.string2regexp.apply(CharacterRegexpUtil, halfWidthCharList);
    };

    JapaneseWrapManager.prototype.overwriteFindWrapColumn = function(displayBuffer) {
      if (displayBuffer.japaneseWrapManager == null) {
        displayBuffer.japaneseWrapManager = this;
      }
      if (displayBuffer.originalFindWrapColumn == null) {
        displayBuffer.originalFindWrapColumn = displayBuffer.findWrapColumn;
      }
      return displayBuffer.findWrapColumn = function(line, softWrapColumn) {
        if (softWrapColumn == null) {
          softWrapColumn = this.getSoftWrapColumn();
        }
        if (!this.isSoftWrapped()) {
          return;
        }
        if (!((line.length * 2) > softWrapColumn)) {
          return;
        }
        return this.japaneseWrapManager.findJapaneseWrapColumn(line, softWrapColumn);
      };
    };

    JapaneseWrapManager.prototype.restoreFindWrapColumn = function(displayBuffer) {
      if (displayBuffer.originalFindWrapColumn != null) {
        displayBuffer.findWrapColumn = displayBuffer.originalFindWrapColumn;
        displayBuffer.originalFindWrapColumn = void 0;
      }
      if (displayBuffer.japaneseWrapManager != null) {
        return displayBuffer.japaneseWrapManager = void 0;
      }
    };

    JapaneseWrapManager.prototype.findJapaneseWrapColumn = function(line, softWrapColumn) {
      var column, cutable, size, wrapColumn, _i, _j, _k, _ref, _ref1;
      size = 0;
      for (wrapColumn = _i = 0, _ref = line.length; 0 <= _ref ? _i < _ref : _i > _ref; wrapColumn = 0 <= _ref ? ++_i : --_i) {
        if (this.zeroWidthCharRegexp.test(line[wrapColumn])) {
          continue;
        } else if (this.halfWidthCharRegexp.test(line[wrapColumn])) {
          size = size + 1;
        } else {
          size = size + 2;
        }
        if (size > softWrapColumn) {
          if (this.lineBreakingRuleJapanese) {
            column = this.searchBackwardNotEndingColumn(line, wrapColumn);
            if (column != null) {
              return column;
            }
            column = this.searchForwardWhitespaceCutableColumn(line, wrapColumn);
            if (column == null) {
              cutable = false;
            } else if (column === wrapColumn) {
              cutable = true;
            } else {
              return column;
            }
            return this.searchBackwardCutableColumn(line, wrapColumn, cutable, this.wordCharRegexp.test(line[wrapColumn]));
          } else {
            if (this.wordCharRegexp.test(line[wrapColumn])) {
              for (column = _j = wrapColumn; wrapColumn <= 0 ? _j <= 0 : _j >= 0; column = wrapColumn <= 0 ? ++_j : --_j) {
                if (!this.wordCharRegexp.test(line[column])) {
                  return column + 1;
                }
              }
              return wrapColumn;
            } else {
              for (column = _k = wrapColumn, _ref1 = line.length; wrapColumn <= _ref1 ? _k <= _ref1 : _k >= _ref1; column = wrapColumn <= _ref1 ? ++_k : --_k) {
                if (!this.whitespaceCharRegexp.test(line[column])) {
                  return column;
                }
              }
              return line.length;
            }
          }
        }
      }
    };

    JapaneseWrapManager.prototype.searchBackwardNotEndingColumn = function(line, wrapColumn) {
      var column, foundNotEndingColumn, _i, _ref;
      foundNotEndingColumn = null;
      for (column = _i = _ref = wrapColumn - 1; _ref <= 0 ? _i <= 0 : _i >= 0; column = _ref <= 0 ? ++_i : --_i) {
        if (this.whitespaceCharRegexp.test(line[column])) {
          continue;
        } else if (this.notEndingCharRegexp.test(line[column])) {
          foundNotEndingColumn = column;
        } else {
          return foundNotEndingColumn;
        }
      }
    };

    JapaneseWrapManager.prototype.searchForwardWhitespaceCutableColumn = function(line, wrapColumn) {
      var column, _i, _ref;
      for (column = _i = wrapColumn, _ref = line.length; wrapColumn <= _ref ? _i < _ref : _i > _ref; column = wrapColumn <= _ref ? ++_i : --_i) {
        if (!this.whitespaceCharRegexp.test(line[column])) {
          if (this.notStartingCharRexgep.test(line[column])) {
            return null;
          } else {
            return column;
          }
        }
      }
      return line.length;
    };

    JapaneseWrapManager.prototype.searchBackwardCutableColumn = function(line, wrapColumn, cutable, preWord) {
      var column, preColumn, _i, _ref;
      for (column = _i = _ref = wrapColumn - 1; _ref <= 0 ? _i <= 0 : _i >= 0; column = _ref <= 0 ? ++_i : --_i) {
        if (this.whitespaceCharRegexp.test(line[column])) {
          if (cutable || preWord) {
            preColumn = this.searchBackwardNotEndingColumn(line, column);
            if (preColumn != null) {
              preColumn;
            } else {
              return column + 1;
            }
          }
        } else if (this.notEndingCharRegexp.test(line[column])) {
          cutable = true;
          if (this.wordCharRegexp.test(line[column])) {
            preWord = true;
          } else {
            preWord = false;
          }
        } else if (this.notStartingCharRexgep.test(line[column])) {
          if (cutable || preWord) {
            return column + 1;
          } else {
            cutable = false;
            if (this.wordCharRegexp.test(line[column])) {
              preWord = true;
            } else {
              preWord = false;
            }
          }
        } else if (this.wordCharRegexp.test(line[column])) {
          if ((!preWord) && cutable) {
            return column + 1;
          } else {
            preWord = true;
          }
        } else {
          if (cutable || preWord) {
            return column + 1;
          } else {
            cutable = true;
            preWord = false;
          }
        }
      }
      return wrapColumn;
    };

    return JapaneseWrapManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVIsQ0FEdEIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLG1CQUFDLENBQUEsZ0JBQUQsR0FBb0IsT0FBQSxDQUFRLHFCQUFSLENBQXBCLENBQUE7O0FBRWEsSUFBQSw2QkFBQSxHQUFBO0FBQ1gsVUFBQSwwQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLGNBQUEsR0FBaUIsQ0FLZiwrQkFMZSxFQU1mLHlCQU5lLEVBUWYsb0NBUmUsRUFTZiwrQ0FUZSxDQUZqQixDQUFBO0FBYUEsV0FBQSxxREFBQTtrQ0FBQTtBQUNFLFFBQUEsVUFBQSxHQUFhLGdCQUFBLEdBQW1CLElBQWhDLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixVQUFwQixFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsUUFBRCxHQUFBO21CQUM5QixLQUFDLENBQUEsZUFBRCxDQUFBLEVBRDhCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEMsQ0FEQSxDQURGO0FBQUEsT0FiQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSx3QkFBRCxHQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsQ0FsQkosQ0FBQTtBQUFBLE1BbUJBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix5Q0FBcEIsRUFDSSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxRQUFELEdBQUE7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
//# sourceURL=/c:/Users/LesanceDtAY/.atom/packages/japanese-wrap/lib/japanese-wrap-manager.coffee