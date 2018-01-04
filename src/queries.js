import gql from 'graphql-tag'

// Queries
export const CurrentUserQuery = gql`
  query CurrentUserQuery($id: String!) {
    user(id: $id) {
      user_id
      name
      picture
    }
  }
`

export const MeetingsQuery = gql`
  query MeetingsQuery {
    allMeetings {
      id
      date
      group {
        id
        name
        color
      }
    }
  }
`

export const MeetingQuery = gql`
  query MeetingQuery($id: ID!) {
    Meeting(id: $id) {
      id
      date
      group {
        id
        name
        color
      }
      #attendants {
      #  user_id
      #}
    }
  }
`

export const GroupQuery = gql`
  query GroupQuery($id: Int!) {
    Group(id: $id) {
      name
      color
    }
  }
`

export const GroupsQuery = gql`
  query GroupsQuery {
    allGroups {
      id
      name
      color
    }
  }
`

// Mutations
export const CreateMeeting = gql`
  mutation createMeeting(
      $date: DateTime!
      $groupId: ID!
    ) {
      createMeeting(
        date: $date
        groupId: $groupId
      ) {
        id
        date
        group {
          id
          name
          color
        }
      }
  }
`

export const createAttendant = gql`
  mutation createAttendant($attendant: attendantInput!) {
    createAttendant(attendant: $attendant) {
      meetingId
    }
  }
`

export const createGroup = gql`
  mutation createGroup(
    $name: String!
    $color: String!
  ) {
    createGroup(
      name: $name
      color: $color
    ) {
      id
      name
      color
    }
  }
`