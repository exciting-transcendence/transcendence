import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import { mockUser } from 'mock/mockUser'
import { ProfileCard } from './Profile'
import { User } from 'data/User.dto'

export default {
  title: 'Profile/Profile',
  component: ProfileCard,
} as ComponentMeta<typeof ProfileCard>

const Template: ComponentStory<typeof ProfileCard> = (args) => (
  <ProfileCard {...args} />
)

export const Default = Template.bind({})
Default.args = { user: mockUser }

export const Playing = Template.bind({})
Playing.args = { user: { ...mockUser, status: 123 } as User }

// FIXME: 이름 ProfileCard로 변경
