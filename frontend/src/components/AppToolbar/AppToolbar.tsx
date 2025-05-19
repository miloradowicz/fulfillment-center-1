import UserMenu from './UserMenu.tsx'
import { selectUser } from '@/store/slices/authSlice.ts'
import { useAppSelector } from '@/app/hooks.ts'
import { featureProtection } from '@/constants.ts'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet.tsx'
import { Button } from '@/components/ui/button.tsx'
import { NavLink } from 'react-router-dom'
import SidebarContent from '@/components/SidebarContent/SidebarContent.tsx'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'

const AppToolbar = () => {
  const user = useAppSelector(selectUser)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <header className="fixed top-0 left-0 w-full bg-primary text-primary-foreground z-50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-3">
          {(!featureProtection || user) && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="transition-colors"
                >
                  <Menu className="w-7 h-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] p-0 [&>button.absolute]:hidden">
                <VisuallyHidden>
                  <DialogTitle>Навигация по сайту</DialogTitle>
                  <DialogDescription>Сайдбар с навигацией по страницам приложения</DialogDescription>
                </VisuallyHidden>
                <SidebarContent onLinkClick={() => setIsOpen(false)} />
              </SheetContent>
            </Sheet>
          )}

          <NavLink to="/" className=" rounded-md">
            <img src="/logo.png" alt="logo" className="h-[80px] object-cover" />
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <NavLink to="/login">
              <Button type="button" variant="secondary" className="transition-colors font-bold">
                Войти
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppToolbar
