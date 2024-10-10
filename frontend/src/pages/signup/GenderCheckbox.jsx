import React from 'react'

function GenderCheckbox() {
  return (
    <dix className="flex">
        <div className="form-control">
            <label className="cursor-pointer label gap-2">
                <span className="label-text">Male  </span>
                <input type="checkbox" className="checkbox border-slate-900" />
            </label>
        </div>
        <div className="form-control">
            <label className="cursor-pointer label gap-2">
                <span className="label-text">Female  </span>
                <input type="checkbox" className="checkbox border-slate-900" />
            </label>
        </div>
    </dix>
  )
}

export default GenderCheckbox;