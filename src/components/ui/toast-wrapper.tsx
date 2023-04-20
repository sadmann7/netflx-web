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
          background: "#ffffff",
          color: "#000000",
        },
      }}
    />
  )
}

export default ToastWrapper
