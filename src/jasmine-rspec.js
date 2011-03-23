var after, be, be_called, be_empty, be_false, be_greater_than, be_less_than, be_null, be_true, be_within, before, contain_text, context, dummy_subject, equal, expect_it, expect_its, have, have_css_class, have_query_string, have_table_data, include, it, it_, it_should_behave_like, its, jit, last_when, let_, match, match_object, matcher, propagate, respond_to, select, shared_examples, shared_examples_for, subject, the, then_, when_, xthe, _, _should;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty;
subject = null;
shared_examples = {};
context = describe;
before = beforeEach;
after = afterEach;
xthe = xit;
subject = function(f) {
  return before(function() {
    return subject = f();
  });
};
let_ = __bind(function(name, f) {
  return before(__bind(function() {
    return this[name] = f();
  }, this));
}, this);
expect_its = function(thing, f) {
  return it("its " + thing + " should ...", function() {
    return f.call(expect(eval("subject." + thing)));
  });
};
expect_it = function(f) {
  return it("should ...", function() {
    return f.call(expect(subject));
  });
};
shared_examples_for = function(name, f) {
  return shared_examples[name] = f;
};
it_should_behave_like = function(name, g) {
  var f;
  f = shared_examples[name];
  if (typeof f === "function") {
    f();
  }
  return typeof g === "function" ? g() : void 0;
};
last_when = null;
when_ = function(desc, f) {
  return last_when = [desc, f];
};
then_ = function(g) {
  var desc, f;
  desc = last_when[0], f = last_when[1];
  return context("when " + desc, function() {
    if (f) {
      before(f);
    }
    return g();
  });
};
jit = it;
dummy_subject = {
  should: function(matcher) {
    return matcher;
  },
  should_not: function(matcher) {
    return matcher.reverse;
  }
};
it_ = function(f) {
  return jit("", function() {
    var m, matcher;
    matcher = f.call(dummy_subject);
    m = matcher.complete(subject);
    this.description = "it should " + (m.description());
    return expect(m).toBeRspec();
  });
};
its = function(thing, f) {
  return jit("", function() {
    var m, matcher;
    matcher = f.call(dummy_subject);
    m = matcher.complete(eval("subject." + thing));
    this.description = "its " + thing + " should " + (m.description());
    return expect(m).toBeRspec();
  });
};
the = function(thing, f) {
  return jit("", function() {
    var m, matcher;
    matcher = f.call(dummy_subject);
    m = matcher.complete(eval("window." + thing));
    this.description = "the " + thing + " should " + (m.description());
    return expect(m).toBeRspec();
  });
};
_should = function(actual, matcher) {
  var m;
  m = matcher.complete(actual);
  return expect(m).toBeRspec();
};
_ = function(x) {
  return {
    should: function(matcher) {
      return _should(x, matcher);
    },
    should_not: function(matcher) {
      return _should(x, matcher.reverse);
    }
  };
};
it = function(desc, f) {
  if (f) {
    return jit(desc, f);
  } else {
    return it_(desc);
  }
};
matcher = function(f) {
  return function() {
    var args, body, desc, helpers, matches, msg, rev, rev_desc, rev_matches, rev_msg;
    desc = rev_desc = null;
    matches = rev_matches = null;
    msg = rev_msg = null;
    helpers = null;
    args = arguments;
    rev = {
      description: function(g) {
        return rev_desc = g;
      },
      matches: function(g) {
        return rev_matches = g;
      },
      message: function(g) {
        return rev_msg = g;
      }
    };
    body = {
      description: function(g) {
        return desc = g;
      },
      matches: function(g) {
        return matches = g;
      },
      message: function(g) {
        return msg = g;
      },
      reverse: function(g) {
        return g.apply(rev, args);
      },
      helpers: function(g) {
        return helpers = g.apply(body, args);
      }
    };
    f.apply(body, args);
    rev_desc || (rev_desc = function() {
      return "not " + (desc());
    });
    return {
      description: desc,
      reverse: {
        description: rev_desc,
        complete: function(actual) {
          var ret, _fn;
          ret = {
            actual: actual,
            description: rev_desc
          };
          rev_matches || (rev_matches = function() {
            return !matches.call(ret);
          });
          ret.matches = function() {
            return rev_matches.call(ret);
          };
          if (rev_msg) {
            ret.message = function() {
              return rev_msg.call(ret);
            };
          }
          _fn = function(name, g) {
            return ret[name] = function() {
              return g.apply(ret, arguments);
            };
          };
          for (name in helpers) {
            if (!__hasProp.call(helpers, name)) continue;
            g = helpers[name];
            _fn(name, g);
          }
          return ret;
        }
      },
      complete: function(actual) {
        var ret, _fn;
        ret = {
          actual: actual,
          description: desc
        };
        ret.matches = function() {
          return matches.call(ret);
        };
        if (msg) {
          ret.message = function() {
            return msg.call(ret);
          };
        }
        _fn = function(name, g) {
          return ret[name] = function() {
            return g.apply(ret, arguments);
          };
        };
        for (name in helpers) {
          if (!__hasProp.call(helpers, name)) continue;
          g = helpers[name];
          _fn(name, g);
        }
        return ret;
      }
    };
  };
};
respond_to = matcher(function(name) {
  this.description(function() {
    return "respond to ." + name + "()";
  });
  this.matches(function() {
    return typeof this.actual[name] === 'function';
  });
  this.message(function() {
    return "Expected it to " + (this.description());
  });
  return this.reverse(function() {
    return this.message(function() {
      return "Expected it not to " + (this.description());
    });
  });
});
have = matcher(function(number, collection) {
  this.description(function() {
    return "contain " + number + " " + collection;
  });
  return this.matches(function() {
    return this.actual[collection].length === number;
  });
});
be_null = matcher(function() {
  this.description(function() {
    return "be null";
  });
  return this.matches(function() {
    return this.actual === null;
  });
});
be_empty = matcher(function() {
  this.description(function() {
    return "be empty";
  });
  return this.matches(function() {
    var x, y, _ref;
    _ref = this.actual;
    for (x in _ref) {
      if (!__hasProp.call(_ref, x)) continue;
      y = _ref[x];
      return false;
    }
    return true;
  });
});
match = matcher(function(pattern) {
  this.description(function() {
    return "match " + pattern;
  });
  return this.matches(function() {
    return pattern.test(this.actual);
  });
});
equal = matcher(function(expected) {
  this.description(function() {
    return "equal " + (JSON.stringify(expected));
  });
  return this.matches(function() {
    return jasmine.getEnv().equals_(this.actual, expected);
  });
});
be_true = matcher(function() {
  this.description(function() {
    return "be true";
  });
  return this.matches(function() {
    return this.actual === true;
  });
});
be_false = matcher(function() {
  this.description(function() {
    return "be false";
  });
  return this.matches(function() {
    return this.actual === false;
  });
});
include = matcher(function(item) {
  this.description(function() {
    return "include " + item;
  });
  return this.matches(function() {
    return this.actual.indexOf(item) !== -1;
  });
});
be_greater_than = matcher(function(value) {
  this.description(function() {
    return "be greater than " + value;
  });
  this.matches(function() {
    return this.actual > value;
  });
  return this.reverse(function() {
    return this.description(function() {
      return "be less than or equal to " + value;
    });
  });
});
be_less_than = matcher(function(value) {
  this.description(function() {
    return "be less than " + value;
  });
  this.matches(function() {
    return this.actual < value;
  });
  return this.reverse(function() {
    return this.description(function() {
      return "be greater than or equal to " + value;
    });
  });
});
be_called = matcher(function() {
  this.description(function() {
    return "have been called";
  });
  return this.matches(function() {
    return this.actual.wasCalled;
  });
});
propagate = matcher(function() {
  return this.reverse(function() {
    this.description(function() {
      return "not propagate";
    });
    return this.matches(function() {
      return this.actual.stopPropagation.wasCalled;
    });
  });
});
be_within = function(tol) {
  return {
    of: matcher(function(expected) {
      this.helpers(function() {
        return {
          diff: function() {
            var diff;
            diff = this.actual - expected;
            if (diff < 0) {
              diff = -diff;
            }
            return diff;
          }
        };
      });
      this.description(function() {
        return "be within " + tol + " of " + expected;
      });
      this.matches(function() {
        return this.diff() < tol;
      });
      this.message(function() {
        return "Expected " + this.actual + " to be within " + tol + " of " + expected + ", but was off by " + (this.diff());
      });
      return this.reverse(function() {
        this.description(function() {
          return "be outside " + tol + " of " + expected;
        });
        return this.message(function() {
          return "Expected " + this.actual + " to be outside " + tol + " of " + expected + ", but was within " + (this.diff());
        });
      });
    })
  };
};
have_query_string = matcher(function(query) {
  this.helpers(function() {
    return {
      query_part: function() {
        return this.actual.split('?')[1];
      }
    };
  });
  this.description(function() {
    return "have query string '" + query + "'";
  });
  return this.matches(function() {
    return unescape(this.query_part()) === query;
  });
});
be = matcher(function(name) {
  this.description(function() {
    return "be " + name;
  });
  return this.matches(function() {
    return eval("this.actual.is_" + name + "()");
  });
});
have_table_data = matcher(function(data) {
  this.description(function() {
    return "have tabular data";
  });
  return this.matches(function() {
    var real, td, tr, _i, _j, _len, _len2, _ref, _ref2, _results, _results2;
    real = function() {
      _ref = this.actual.find('tr');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tr = _ref[_i];
        _results.push(function() {
          _ref2 = $(tr).find('td,th');
          _results2 = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            td = _ref2[_j];
            _results2.push($(td).text());
          }
          return _results2;
        }());
      }
      return _results;
    }.call(this);
    return jasmine.getEnv().equals_(real, data);
  });
});
have_css_class = matcher(function(name) {
  this.description(function() {
    return "have css class '" + name + "'";
  });
  this.matches(function() {
    return this.actual.hasClass(name);
  });
  return this.message(function() {
    return "Expected node to have css class '" + name + "'";
  });
});
select = matcher(function(count, selector) {
  this.helpers(function() {
    return {
      actual_count: function() {
        return this.actual.find(selector).size();
      }
    };
  });
  this.description(function() {
    return "select " + count + " elements with '" + selector + "'";
  });
  this.matches(function() {
    return this.actual_count() === count;
  });
  return this.message(function() {
    return "Expected node to select " + count + " elements with '" + selector + "', actually selected " + (this.actual_count());
  });
});
contain_text = matcher(function(text) {
  this.description(function() {
    return "contain text " + text;
  });
  this.message(function() {
    return "Expected node to contain text '" + text + "', was '" + (this.actual.text()) + "'";
  });
  return this.matches(function() {
    return this.actual.text().strip() === text;
  });
});
match_object = matcher(function(object) {
  this.description(function() {
    return "match " + (JSON.stringify(object));
  });
  this.matches(function() {
    var key, value;
    for (key in object) {
      if (!__hasProp.call(object, key)) continue;
      value = object[key];
      if (!jasmine.getEnv().equals_(this.actual[key], value)) {
        return false;
      }
    }
    return true;
  });
  return this.message(function() {
    return "Expected the object to match " + (JSON.stringify(object));
  });
});
beforeEach(function() {
  return this.addMatchers({
    toBeRspec: function(reverse) {
      var m;
      m = this.actual;
      if (m.matches()) {
        return true;
      } else {
        if (m.message) {
          this.message = m.message;
        } else {
          this.message = function() {
            var not_str;
            not_str = (reverse ? " NOT " : void 0) || " ";
            try {
              return "Expected " + (JSON.stringify(m.actual)) + not_str + "to " + (m.description());
            } catch (e) {
              return "Expected it" + not_str + "to " + (m.description());
            }
          };
        }
        return false;
      }
    }
  });
});
