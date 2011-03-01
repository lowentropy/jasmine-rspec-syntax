subject = null
shared_examples = {}
context = describe
before = beforeEach
after = afterEach

subject = (f) ->
  before -> subject = f()

let_ = (name, f) =>
  before => this[name] = f()

expect_its = (thing, f) ->
  it "its #{thing} should ...", ->
    f.call expect(eval("subject.#{thing}"))

expect_it = (f) ->
  it "should ...", ->
    f.call expect(subject)

shared_examples_for = (name, f) ->
  shared_examples[name] = f

it_should_behave_like = (name, g) ->
  f = shared_examples[name]
  f?()
  g?()

last_when = null

when_ = (desc, f) ->
  last_when = [desc, f]

then_ = (g) ->
  [desc, f] = last_when
  context "when #{desc}", ->
    before f
    g()

jit = it
dummy_subject =
  should: (matcher) -> matcher
  should_not: (matcher) -> matcher.reverse

it_ = (f) ->
  jit "", ->
    matcher = f.call dummy_subject
    m = matcher.complete subject
    this.description = "should #{m.description()}"
    expect(m).toBeRspec()

its = (thing, f) ->
  jit "", ->
    matcher = f.call dummy_subject
    m = matcher.complete eval("subject.#{thing}")
    this.description = "#{thing} should #{m.description()}"
    expect(m).toBeRspec()

the = (thing, f) ->
  jit "", ->
    matcher = f.call dummy_subject
    m = matcher.complete eval("window.#{thing}")
    this.description = "the #{thing} should #{m.description()}"
    expect(m).toBeRspec()

_should = (actual, matcher) ->
  m = matcher.complete(actual)
  expect(m).toBeRspec()

_ = (x) ->
  should: (matcher) ->
    _should(x, matcher)
  should_not: (matcher) ->
    _should(x, matcher.reverse)

it = (desc, f) ->
  if f
    jit desc, f
  else
    it_ desc

# matcher stuff

matcher = (f) ->
  return ->
    desc = rev_desc = null
    matches = rev_matches = null
    msg = rev_msg = null
    helpers = null
    args = arguments
    rev =
      description: (f) -> rev_desc = f
      matches: (f) -> rev_matches = f
      message: (f) -> rev_msg = f
    body =
      description: (f) -> desc = f
      matches: (f) -> matches = f
      message: (f) -> msg = f
      reverse: (f) -> f.apply(rev, args)
      helpers: (f) -> helpers = f.apply(body, args)
    f.apply(body, args)
    rev_desc ||= -> "not #{desc()}"
    return(
      description: desc
      reverse:
        description: rev_desc
        complete: (actual) ->
          ret =
            actual: actual
            description: rev_desc
          rev_matches ||= -> !matches.call(ret)
          ret.matches = -> rev_matches.call(ret)
          if rev_msg
            ret.message = -> rev_msg.call(ret)
          for name, f of helpers
            ret[name] = -> f.call(ret)
          ret
      complete: (actual) ->
        ret =
          actual: actual
          description: desc
        ret.matches = -> matches.call(ret)
        if msg
          ret.message = -> msg.call(ret)
        for name, f of helpers
          ret[name] = -> f.call(ret)
        ret
    )


respond_to = matcher (name) ->
  @description -> "respond to .#{name}()"
  @matches -> typeof(@actual[name]) == 'function'
  @message -> "Expected it to #{@description()}"
  @reverse -> @message -> "Expected it not to #{@description()}"

have = (number) ->
  items: matcher ->
    @description -> "contain #{number} items"
    @matches -> @actual.length == number

be_null = matcher ->
  @description -> "be null"
  @matches -> @actual == null

be_empty = matcher ->
  @description -> "be empty"
  @matches ->
    for x,y of @actual
      return false
    true

match = matcher (pattern) ->
  @description -> "match #{pattern}"
  @matches -> pattern.test(@actual)

equal = matcher (expected) ->
  @description -> "equal #{expected}"
  @matches -> jasmine.getEnv().equals_(@actual, expected)

be_true = matcher ->
  @description -> "be true"
  @matches -> @actual == true

be_false = matcher ->
  @description -> "be false"
  @matches -> @actual == false

include = matcher (item) ->
  @description -> "include #{item}"
  @matches -> @actual.indexOf(item) != -1

be_greater_than = matcher (value) ->
  @description -> "be greater than #{value}"
  @matches -> @actual > value
  @reverse -> @description -> "be less than or equal to #{value}"

be_less_than = matcher (value) ->
  @description -> "be less than #{value}"
  @matches -> @actual < value
  @reverse -> @description -> "be greater than or equal to #{value}"

be_called = matcher ->
  @description -> "have been called"
  @matches -> @actual.wasCalled

propagate = matcher ->
  @reverse ->
    @description -> "not propagate"
    @matches -> @actual.stopPropagation.wasCalled

be_within = (tol) ->
  of: matcher (expected) ->
    @helpers ->
      diff: ->
        diff = @actual - expected
        diff = -diff if diff < 0
        diff

    @description -> "be within #{tol} of #{expected}"
    @matches -> @diff() < tol
    @message -> "Expected #{@actual} to be within #{tol} of #{expected}, but was off by #{@diff()}"

    @reverse ->
      @description -> "be outside #{tol} of #{expected}"
      @message -> "Expected #{@actual} to be outside #{tol} of #{expected}, but was within #{@diff()}"

