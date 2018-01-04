import React from 'react'

import { pure, compose, withState, withHandlers } from 'recompact'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'

import { GroupsQuery, createGroup } from '../../queries'

import Modal from '../Modal'

const GroupFormPure = ({ onSubmit, onChangeName, onChangeColor }) =>
  <Modal locationOnClose="/groups">
    <Container>
      <form onSubmit={onSubmit}>
        Ny gruppe
        <Input
          required
          type="text"
          placeholder="name"
          onChange={onChangeName}
        />
        <Select onChange={onChangeColor}>
          <option value="#48ACF0">Lyseblå</option>
          <option value="#B74F6F">Lilla</option>
          <option value="#1C77C3">Mørkeblå</option>
        </Select>
        <input type="submit" value="submit" />
      </form>
    </Container>
  </Modal>

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`

const Input = styled.input`
  padding: .5rem;
  margin: 1rem;
`

const Select = styled.select`
  padding: .5rem;
  margin: 1rem;
`

GroupFormPure.defaultProps = {
  color: 'black'
}

const submitProp = {
  props: ({ mutate }) => ({
    submit: ({ name, color }) =>
      mutate({
        variables: { name, color },
        update: (store, { data: { createGroup } }) => {
          const data = store.readQuery({ query: GroupsQuery })
          data.allGroups.unshift(createGroup)
          store.writeQuery({ query: GroupsQuery, data })
        }
      })
  })
}

const handlers = {
  onChangeName: props => event => {
    props.updateName(event.target.value)
  },
  onChangeColor: props => event => {
    props.updateColor(event.target.value)
  },
  onSubmit: props => event => {
    event.preventDefault()
    let { name, color } = props
    props.submit({ name, color })
  }
}

export default compose(
  graphql(createGroup, submitProp),
  withState('name', 'updateName', ''),
  withState('color', 'updateColor', '#48ACF0'),
  withHandlers(handlers),
  pure
)(GroupFormPure)
