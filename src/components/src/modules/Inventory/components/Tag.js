import React from 'react'

const Tag = ({ className, tagName }) => {
  return (
    <span className={`block text-white py-0.5 px-2 rounded-3xl w-min text-xs mt-1 ${className}`}>
      {tagName}
    </span>
  )
}

export default Tag
