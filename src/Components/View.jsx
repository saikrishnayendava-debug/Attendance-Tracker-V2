import React from 'react'

const View = ({Url}) => {
  return (
    <div>
      <iframe src={Url} width="100%" height="100%" />
    </div>
  )
}

export default View
