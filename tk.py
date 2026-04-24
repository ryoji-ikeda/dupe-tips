import tkinter as tk

root = tk.Tk()
root.title("DuperTrooper Private Hacks V4.0.7")
root.geometry("646x305")
root.resizable(False, False)
root.configure(bg="#eeeeee")

# Helps make Tkinter sizing closer to the screenshot
root.tk.call("tk", "scaling", 1.0)

BG = "#eeeeee"

# Title
title = tk.Label(
    root,
    text="DuperPanelV4",
    font=("Arial", 34, "bold"),
    fg="red",
    bg=BG
)
title.place(x=176, y=23)

# Minecraft username label
username_label = tk.Label(
    root,
    text="Minecraft Username:",
    font=("Arial", 11),
    fg="black",
    bg=BG
)
username_label.place(x=60, y=106)

# Entry box
username_entry = tk.Entry(
    root,
    font=("Arial", 10),
    bd=2,
    relief="sunken",
    highlightthickness=0
)
username_entry.place(x=208, y=102, width=380, height=22)
username_entry.insert(0, "Cinnamonpurr")

# Checkboxes
use_proxy_var = tk.BooleanVar(value=True)
clear_cookies_var = tk.BooleanVar(value=True)

use_proxy = tk.Checkbutton(
    root,
    text="Use Proxy",
    variable=use_proxy_var,
    font=("Arial", 10),
    bg=BG,
    fg="black",
    activebackground=BG,
    highlightthickness=0,
    bd=0
)
use_proxy.place(x=202, y=137)

clear_cookies = tk.Checkbutton(
    root,
    text="Clear Cookies",
    variable=clear_cookies_var,
    font=("Arial", 10),
    bg=BG,
    fg="black",
    activebackground=BG,
    highlightthickness=0,
    bd=0
)
clear_cookies.place(x=345, y=137)

# Radio buttons
mode_var = tk.StringVar(value="GMC")

forceop = tk.Radiobutton(
    root,
    text="ForceOP",
    variable=mode_var,
    value="ForceOP",
    font=("Arial", 10),
    bg=BG,
    fg="black",
    activebackground=BG,
    highlightthickness=0,
    bd=0
)
forceop.place(x=187, y=173)

gmc = tk.Radiobutton(
    root,
    text="GMC",
    variable=mode_var,
    value="GMC",
    font=("Arial", 10),
    bg=BG,
    fg="black",
    activebackground=BG,
    highlightthickness=0,
    bd=0
)
gmc.place(x=305, y=173)

unban = tk.Radiobutton(
    root,
    text="Unban",
    variable=mode_var,
    value="Unban",
    font=("Arial", 10),
    bg=BG,
    fg="black",
    activebackground=BG,
    highlightthickness=0,
    bd=0
)
unban.place(x=402, y=173)

# Custom old-style buttons using Canvas for the thick black bottom/right shadow
def old_button(parent, text, x, y, command=None):
    c = tk.Canvas(
        parent,
        width=138,
        height=29,
        bg=BG,
        highlightthickness=0,
        bd=0
    )
    c.place(x=x, y=y)

    # Button face
    c.create_rectangle(0, 0, 136, 26, fill="#eeeeee", outline="#bdbdbd")

    # 3D highlight top/left
    c.create_line(0, 0, 136, 0, fill="white")
    c.create_line(0, 0, 0, 26, fill="white")

    # Dark bottom/right shadow
    c.create_line(1, 27, 138, 27, fill="black", width=2)
    c.create_line(137, 1, 137, 28, fill="black", width=2)

    c.create_text(69, 14, text=text, fill="black", font=("Arial", 10))

    if command:
        c.bind("<Button-1>", lambda e: command())

    return c

old_button(root, "Execute", 134, 216)
old_button(root, "Exit", 372, 216, root.destroy)

root.mainloop()