import UserMenu from './UserMenu.tsx'
import { selectUser } from '@/store/slices/authSlice.ts'
import { useAppSelector } from '@/app/hooks.ts'
import { featureProtection } from '@/constants.ts'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.tsx'
import { Button } from '@/components/ui/button.tsx'
import { NavLink } from 'react-router-dom'
import SidebarContent from '@/components/SidebarContent/SidebarContent.tsx'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DialogTitle } from '@radix-ui/react-dialog'

const AppToolbar = () => {
  const user = useAppSelector(selectUser)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-slate-800 text-white z-50 border-b border-muted/20">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 md:px-8">
          <div className="flex items-center content-between gap-3">
            {(!featureProtection || user) && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    className="hover:bg-0 bg-0 text-white p-2 hover:text-slate-300 cursor-pointer transition-colors"
                    type="button"
                  >
                    <Menu className="w-7 h-7" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] p-0 [&>button.absolute]:hidden">
                  <VisuallyHidden>
                    <DialogTitle>Навигация по сайту</DialogTitle>
                  </VisuallyHidden>
                  <SidebarContent onLinkClick={() => setIsOpen(false)} />
                </SheetContent>
              </Sheet>
            )}

            <NavLink to="/" className="bg-white rounded-md">
              <img src="/logo.png" alt="logo" className="h-[40px] object-cover cursor-pointer" />
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <NavLink to="/login">
                <Button
                  type="button"
                  variant="outline"
                  className="
                  transition-colors
                  cursor-pointer
                  border-white
                  text-slate-800
                  hover:text-slate-800
                  focus:text-slate-800
                  hover:border-slate-300
                  focus:border-slate-300
                  hover:bg-slate-200
                  focus:bg-slate-300"
                >
                  Войти
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default AppToolbar
