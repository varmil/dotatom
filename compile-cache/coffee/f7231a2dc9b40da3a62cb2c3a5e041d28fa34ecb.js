(function() {
  var UnicodeUtil,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = UnicodeUtil = (function() {
    var _i, _j, _results, _results1;

    function UnicodeUtil() {}

    UnicodeUtil.unicode = require('./unicode');

    UnicodeUtil.highSurrogateRange = (function() {
      _results = [];
      for (_i = 0xD800; _i <= 56319; _i++){ _results.push(_i); }
      return _results;
    }).apply(this);

    UnicodeUtil.lowSurrogateRange = (function() {
      _results1 = [];
      for (_j = 0xDC00; _j <= 57343; _j++){ _results1.push(_j); }
      return _results1;
    }).apply(this);

    UnicodeUtil.getBlockName = function(str) {
      var block, charCode, _k, _len, _ref;
      charCode = this.unicodeCharCodeAt(str);
      _ref = this.unicode;
      for (_k = 0, _len = _ref.length; _k < _len; _k++) {
        block = _ref[_k];
        if (__indexOf.call(block[0], charCode) >= 0) {
          return block[1];
        }
      }
      return null;
    };

    UnicodeUtil.getRangeListByName = function(name) {
      var block, rangeList, _k, _len, _ref;
      rangeList = new Array();
      _ref = this.unicode;
      for (_k = 0, _len = _ref.length; _k < _len; _k++) {
        block = _ref[_k];
        if (block[1].contains(name)) {
          rangeList = rangeList.concat([block[0]]);
        }
      }
      return rangeList;
    };

    UnicodeUtil.unicodeCharCodeAt = function(str, index) {
      var charCode, charCodeHigh, charCodeLow, i, surrogateCount, _k, _ref;
      if (index == null) {
        index = 0;
      }
      surrogateCount = 0;
      for (i = _k = 0; 0 <= index ? _k < index : _k > index; i = 0 <= index ? ++_k : --_k) {
        if (_ref = str.charCodeAt(i + surrogateCount), __indexOf.call(this.highSurrogateRange, _ref) >= 0) {
          surrogateCount += 1;
        }
      }
      index += surrogateCount;
      charCode = str.charCodeAt(index);
      if (__indexOf.call(this.highSurrogateRange, charCode) >= 0) {
        charCodeHigh = charCode;
        charCodeLow = str.charCodeAt(index + 1);
        if (__indexOf.call(this.lowSurrogateRange, charCodeLow) >= 0) {
          charCode = 0x10000 + (charCodeHigh - 0xD800) * 0x400 + charCodeLow - 0xDC00;
        }
      }
      return charCode;
    };

    return UnicodeUtil;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixRQUFBLDJCQUFBOzs2QkFBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVcsT0FBQSxDQUFRLFdBQVIsQ0FBWCxDQUFBOztBQUFBLElBR0EsV0FBQyxDQUFBLGtCQUFELEdBQXNCOzs7O2tCQUh0QixDQUFBOztBQUFBLElBSUEsV0FBQyxDQUFBLGlCQUFELEdBQXFCOzs7O2tCQUpyQixDQUFBOztBQUFBLElBTUEsV0FBQyxDQUFBLFlBQUQsR0FBZSxTQUFDLEdBQUQsR0FBQTtBQUNiLFVBQUEsK0JBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsR0FBbkIsQ0FBWCxDQUFBO0FBQ0E7QUFBQSxXQUFBLDJDQUFBO3lCQUFBO0FBQ0UsUUFBQSxJQUFHLGVBQVksS0FBTSxDQUFBLENBQUEsQ0FBbEIsRUFBQSxRQUFBLE1BQUg7QUFDRSxpQkFBTyxLQUFNLENBQUEsQ0FBQSxDQUFiLENBREY7U0FERjtBQUFBLE9BREE7QUFJQSxhQUFPLElBQVAsQ0FMYTtJQUFBLENBTmYsQ0FBQTs7QUFBQSxJQWFBLFdBQUMsQ0FBQSxrQkFBRCxHQUFxQixTQUFDLElBQUQsR0FBQTtBQUNuQixVQUFBLGdDQUFBO0FBQUEsTUFBQSxTQUFBLEdBQWdCLElBQUEsS0FBQSxDQUFBLENBQWhCLENBQUE7QUFDQTtBQUFBLFdBQUEsMkNBQUE7eUJBQUE7QUFDRSxRQUFBLElBQUcsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVQsQ0FBa0IsSUFBbEIsQ0FBSDtBQUNFLFVBQUEsU0FBQSxHQUFZLFNBQVMsQ0FBQyxNQUFWLENBQWlCLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBUCxDQUFqQixDQUFaLENBREY7U0FERjtBQUFBLE9BREE7QUFJQSxhQUFPLFNBQVAsQ0FMbUI7SUFBQSxDQWJyQixDQUFBOztBQUFBLElBb0JBLFdBQUMsQ0FBQSxpQkFBRCxHQUFvQixTQUFDLEdBQUQsRUFBTSxLQUFOLEdBQUE7QUFDbEIsVUFBQSxnRUFBQTs7UUFEd0IsUUFBUTtPQUNoQztBQUFBLE1BQUEsY0FBQSxHQUFpQixDQUFqQixDQUFBO0FBQ0EsV0FBUyw4RUFBVCxHQUFBO0FBQ0UsUUFBQSxXQUFHLEdBQUcsQ0FBQyxVQUFKLENBQWUsQ0FBQSxHQUFJLGNBQW5CLENBQUEsRUFBQSxlQUFzQyxJQUFDLENBQUEsa0JBQXZDLEVBQUEsSUFBQSxNQUFIO0FBQ0UsVUFBQSxjQUFBLElBQWtCLENBQWxCLENBREY7U0FERjtBQUFBLE9BREE7QUFBQSxNQUlBLEtBQUEsSUFBUyxjQUpULENBQUE7QUFBQSxNQUtBLFFBQUEsR0FBVyxHQUFHLENBQUMsVUFBSixDQUFlLEtBQWYsQ0FMWCxDQUFBO0FBT0EsTUFBQSxJQUFHLGVBQVksSUFBQyxDQUFBLGtCQUFiLEVBQUEsUUFBQSxNQUFIO0FBQ0UsUUFBQSxZQUFBLEdBQWUsUUFBZixDQUFBO0FBQUEsUUFDQSxXQUFBLEdBQWMsR0FBRyxDQUFDLFVBQUosQ0FBZSxLQUFBLEdBQVEsQ0FBdkIsQ0FEZCxDQUFBO0FBRUEsUUFBQSxJQUFHLGVBQWUsSUFBQyxDQUFBLGlCQUFoQixFQUFBLFdBQUEsTUFBSDtBQUNFLFVBQUEsUUFBQSxHQUFXLE9BQUEsR0FDQSxDQUFDLFlBQUEsR0FBZSxNQUFoQixDQUFBLEdBQTBCLEtBRDFCLEdBRUEsV0FGQSxHQUVjLE1BRnpCLENBREY7U0FIRjtPQVBBO0FBY0EsYUFBTyxRQUFQLENBZmtCO0lBQUEsQ0FwQnBCLENBQUE7O3VCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/c:/Users/LesanceDtAY/.atom/packages/japanese-wrap/lib/unicode-util.coffee