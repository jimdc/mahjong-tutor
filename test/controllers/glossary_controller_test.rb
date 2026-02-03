require "test_helper"

class GlossaryControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get glossary_url
    assert_response :success
  end
end
