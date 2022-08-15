import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChatList } from './ChatList'

export default {
  title: 'Chat/ChatList',
  component: ChatList,
} as ComponentMeta<typeof ChatList>

const Template: ComponentStory<typeof ChatList> = (args) => (
  <ChatList {...args} />
)

export const Default = Template.bind({})
Default.args = {
  chats: [
    {
      senderUid: 4,
      msgContent: 'Hello',
    },
    {
      senderUid: 2,
      msgContent: 'Hi',
    },
    {
      senderUid: 4,
      msgContent: 'How are you?',
    },
    {
      senderUid: 4,
      msgContent: 'asdf',
    },
    {
      senderUid: 2,
      msgContent: 'lorem ipsum',
    },
  ],
}
