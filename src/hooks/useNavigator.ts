import type { ItemType } from 'ant-design-vue'
import { h, reactive, VueElement } from 'vue'
import { MailOutlined } from '@ant-design/icons-vue'
import axios from 'axios'

export default function () {
  let data: ItemType[] = reactive([])

  async function getData() {
    let result
    try {
      result = await axios.get('http://')
    } catch (e) {}
    if (result != undefined) {
      data = result.data
    }
  }

  return { getData, data }
}
