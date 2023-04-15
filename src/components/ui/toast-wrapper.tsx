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
          background: "#3f3f46",
          color: "#ffffff",
        },
      }}
    />
  )
}

export default ToastWrapper
