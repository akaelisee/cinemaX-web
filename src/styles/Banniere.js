// @ts-nocheck
import styled from 'styled-components'

const Banniere = styled.div.withConfig({
  shouldForwardProp: prop => prop !== 'url'
})`
  background-image: ${props => props.url};
  background-position: center center;
  background-size: cover;
  height: 650px;
`
export default Banniere
