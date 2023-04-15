"use client"

import * as React from "react"
import { DialogTrigger } from "@radix-ui/react-dialog"

import { Dialog } from "@/components/ui/dialog"

interface ModalProps {
  isOpen: boolean
  toggleModal: () => void
}

const Modal = ({ isOpen, toggleModal }: ModalProps) => {
  return (
    <Dialog>
      <DialogTrigger>test</DialogTrigger>
    </Dialog>
  )
}

export default Modal
