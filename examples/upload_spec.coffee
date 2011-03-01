describe 'MultiFileUploader', ->

  # Make sure the file uploader has something to hook onto
  before ->
    $.jasmine.inject "<form style='display:none' action=/upload><input type=file multiple /></form>"

  # All uploaders should have a root and file input. Use let_('uploader')
  # when using this shared example
  shared_examples_for 'any sane uploader', ->
    context 'the uploader object', ->
      subject -> uploader
      its 'root',           -> @should_not be_null()
      its 'file_input',     -> @should_not be_null()
      its 'files',          -> @should be_empty()
      its 'wait_queue',     -> @should be_empty()
      its 'upload_queue',   -> @should be_empty()
      its 'last_unique_id', -> @should equal(0)


  # Test without providing anything to the constructor
  context 'with no arguments', ->
    it_should_behave_like 'any sane uploader', ->

      let_ 'uploader', -> new MultiFileUploader()

      # Test alllll the defaults
      describe 'its options', ->
        subject -> uploader.options

        its 'autoUpload',     -> @should be_false()
        its 'uploadPath',     -> @should equal('/upload')
        its 'multiple',       -> @should be_true()
        its 'progress',       -> @should be_true()
        its 'tokenPath',      -> @should be_null()
        its 'tokenHeader',    -> @should be_null()
        its 'maxConnections', -> @should equal(1)

        # Test the default CSS classes
        describe 'classes', ->
          subject -> uploader.options.classes
          it -> @should equal
            dropArea: 'drop'
            dropActive: 'drop-active',
            uploadPending: 'upload-pending',
            uploadActive: 'upload-active'
            uploadSuccess: 'upload-success',
            uploadFailure: 'upload-failure'


  # Make sure custom options override the defaults
  context 'with custom options', ->
    it_should_behave_like 'any sane uploader', ->

      let_ 'options', ->
        uploadPath: '/foo'
        progress: false

      let_ 'uploader', -> new MultiFileUploader(options)

      subject -> uploader.options

      its 'uploadPath', -> @should equal('/foo')
      its 'progress',   -> @should be_false()
      its 'maxConnections', -> @should equal(1)


  # Test the generated html
  describe 'markup', ->

    describe 'for drop container', ->
      subject -> uploader.drop_container.html()
      it -> @should include('<div class="drop valign-outer">')
      it -> @should include('<span class="valign-inner">')
      it -> @should include('Drag your files in here')

    describe 'for file list', ->
      subject -> uploader.file_list.outerHtml()
      it -> @should equal('<ul class="upload-list"></ul>')

    describe 'for upload button', ->
      before -> uploader.add_upload_button()
      subject -> uploader.upload_button.outerHtml()
      it -> @should equal('<button>Start Upload</button>')


  # Test messages that appear in the drop area for different events
  describe 'messages', ->
    let_ 'uploader', -> new MultiFileUploader()
    let_ 'event', ->
      dataTransfer: {effectAllowed: 'all'}
      stopPropagation: jasmine.createSpy()

    before -> uploader.use_small_intervals()

    in_a_bit = (f) ->
      when_ 'waiting for a bit', -> waits(20)
      then_ -> f

    assert_drop_text = (string) ->
      it "the drop text should equal #{string}", ->
        _(uploader.drop_area.text().trim()).should equal(string)

    when_ 'an empty drag is dropped', ->
      event.dataTransfer.files = []
      uploader.drop_area_drop event
    then_ ->
      assert_drop_text 'Oops, that wasn\'t really a file!'
      the 'event', -> @should_not propagate()
      in_a_bit -> assert_drop_text('Drag your files in here')

    when_ 'a drag is hovering over the drop area', ->
      uploader.activate_drop_area()
    then_ ->
      assert_drop_text('Now drop them!')

    when_ 'some files are dropped', ->
      event.dataTransfer.files = ['foo']
      uploader.drop_area_drop event
    then_ ->
      assert_drop_text 'Thanks!'
      the 'event', -> @should_not propagate()
      in_a_bit -> assert_drop_text("Now you can grab some more files, or press 'Start Upload'")

