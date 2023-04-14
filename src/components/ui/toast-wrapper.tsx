"use client"

import { Toaster } from "react-hot-toast"

const ToastWrapper = () => {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 3000,
        style: {
          background: "#64748b",
          color: "#ffffff",
        },
      }}
    />
  )
}

export default ToastWrapper
