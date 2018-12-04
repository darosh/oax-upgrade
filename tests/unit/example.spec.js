import { shallowMount } from '@vue/test-utils'
import HelloWorld from '../../src/components/elements/api/Method'

describe('Method.vue', () => {
  it('renders props.item when passed', () => {
    const item = 'get'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { item }
    })
    expect(wrapper.text()).toMatch(item)
  })
})
