var after, be_called, be_empty, be_false, be_greater_than, be_less_than, be_null, be_true, be_within, before, context, dummy_subject, equal, expect_it, expect_its, have, include, it, it_, it_should_behave_like, its, jit, last_when, let_, match, matcher, propagate, respond_to, shared_examples, shared_examples_for, subject, the, then_, when_, _, _should;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
subject = null;
shared_examples = {};
context = describe;
before = beforeEach;
after = afterEach;
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
  if (typeof f == "function") {
    f();
  }
  return typeof g == "function" ? g() : void 0;
};
last_when = null;
when_ = function(desc, f) {
  return last_when = [desc, f];
};
then_ = function(g) {
  var desc, f;
  desc = last_when[0], f = last_when[1];
  return context("when " + desc, function() {
    before(f);
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
  return jit("asdf", function() {
    var m, matcher;
    matcher = f.call(dummy_subject);
    m = matcher.complete(subject);
    this.description = "should " + (m.description());
    return expect(m).toBeRspec();
  });
};
its = function(thing, f) {
  return jit("asdf", function() {
    var m, matcher;
    matcher = f.call(dummy_subject);
    m = matcher.complete(eval("subject." + thing));
    this.description = "" + thing + " should " + (m.description());
    return expect(m).toBeRspec();
  });
};
the = function(thing, f) {
  return jit("asdf", function() {
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
      description: function(f) {
        return rev_desc = f;
      },
      matches: function(f) {
        return rev_matches = f;
      },
      message: function(f) {
        return rev_msg = f;
      }
    };
    body = {
      description: function(f) {
        return desc = f;
      },
      matches: function(f) {
        return matches = f;
      },
      message: function(f) {
        return msg = f;
      },
      reverse: function(f) {
        return f.apply(rev, args);
      },
      helpers: function(f) {
        return helpers = f.apply(body, args);
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
          var f, name, ret;
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
          for (name in helpers) {
            f = helpers[name];
            ret[name] = function() {
              return f.call(ret);
            };
          }
          return ret;
        }
      },
      complete: function(actual) {
        var f, name, ret;
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
        for (name in helpers) {
          f = helpers[name];
          ret[name] = function() {
            return f.call(ret);
          };
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
have = function(number) {
  return {
    items: matcher(function() {
      this.description(function() {
        return "contain " + number + " items";
      });
      return this.matches(function() {
        return this.actual.length === number;
      });
    })
  };
};
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
    return "equal " + expected;
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
