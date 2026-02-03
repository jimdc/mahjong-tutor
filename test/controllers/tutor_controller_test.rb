require "test_helper"

class TutorControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get tutor_url
    assert_response :success
  end

  test "root should load" do
    get root_url
    assert_response :success
  end
end
