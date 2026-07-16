import os
import re

files = [
    "components/admin/PortfolioManager.tsx",
    "components/admin/services/ServiceForm.tsx",
    "app/adminlentera/brands/page.tsx",
    "app/adminlentera/schedules/page.tsx",
    "components/admin/projects/ExpenseManager.tsx",
    "components/admin/projects/PaymentManager.tsx",
    "app/adminlentera/clients/page.tsx",
    "app/adminlentera/testimonials/page.tsx",
    "app/adminlentera/expenses/page.tsx",
    "app/adminlentera/projects/page.tsx",
    "app/adminlentera/services/page.tsx"
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r") as f:
        content = f.read()

    # Skip if no alert or confirm
    if "alert(" not in content and "confirm(" not in content:
        continue

    # Add import
    if "useModal" not in content:
        # insert after last import
        import_match = list(re.finditer(r'^import .*\n', content, re.MULTILINE))
        if import_match:
            last_import = import_match[-1]
            insert_pos = last_import.end()
            content = content[:insert_pos] + "import { useModal } from '@/components/admin/ModalContext';\n" + content[insert_pos:]
        else:
            content = "import { useModal } from '@/components/admin/ModalContext';\n" + content

    # Find the main component function declaration to insert hook
    # export default function X() {
    # export function X() {
    func_match = re.search(r'export (?:default )?function ([a-zA-Z0-9_]+)\s*\([^)]*\)\s*{', content)
    if func_match:
        insert_pos = func_match.end()
        # insert hook
        content = content[:insert_pos] + "\n  const { showAlert, showConfirm } = useModal();" + content[insert_pos:]

    # Replace confirm( with await showConfirm(
    content = content.replace("confirm(", "await showConfirm(")
    # Replace alert( with await showAlert(
    content = content.replace("alert(", "await showAlert(")
    
    # Special fix for schedules/page.tsx onSubmit not being async
    if "schedules/page.tsx" in file_path:
        content = content.replace("onSubmit={(e) => { e.preventDefault(); setIsOpen(false); await showAlert", "onSubmit={async (e) => { e.preventDefault(); setIsOpen(false); await showAlert")

    # Special fix for ServiceForm because it's a component not exported at top level but rather export default function ServiceForm
    # Wait, it matched func_match already.

    with open(file_path, "w") as f:
        f.write(content)
    print(f"Refactored {file_path}")
