import { branch, renderNothing } from 'recompact'

//const Loading = () => <Background>Loading</Background>

const displayLoadingState = branch(props => props.data.loading, renderNothing)

export default displayLoadingState
