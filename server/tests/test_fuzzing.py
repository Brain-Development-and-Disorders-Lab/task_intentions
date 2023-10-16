# Custom modules
import util
import common


# Class to test fuzzy input to the server
class TestFuzzing():
  def test_basic(self):
    util.runner(common.Requests.basic, args=(util.ADDR, ))


  def test_no_id(self):
    util.runner(common.Requests.no_id, args=(util.ADDR, ))


  def test_no_responses(self):
    util.runner(common.Requests.no_responses, args=(util.ADDR, ))


  def test_invalid_responses(self):
    util.runner(common.Requests.invalid_responses, args=(util.ADDR, ))
