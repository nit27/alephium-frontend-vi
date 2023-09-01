/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { useNavigation } from '@react-navigation/native'

import { TabBarPageProps } from '~/components/layout/TabBarPager'
import ContactListScreenBase from '~/screens/ContactListScreenBase'
import { Contact } from '~/types/contacts'

const ContactsScreen = ({ onScroll, contentStyle }: TabBarPageProps) => {
  const navigation = useNavigation()

  return (
    <ContactListScreenBase
      onScroll={onScroll}
      onContactPress={(contactId: Contact['id']) => navigation.navigate('ContactScreen', { contactId })}
      onNewContactPress={() => navigation.navigate('NewContactScreen')}
      contentStyle={contentStyle}
    />
  )
}

export default ContactsScreen
