export function getGreeting(): string {
    const hours = new Date().getHours();

    if (hours >= 18) {
        return "Good Evening";
    } else if (hours >= 12) {
        return "Good Afternoon";
    } else if (hours >= 6) {
        return "Good Morning";
    } else if (hours >= 0) {
        return "Good Night";
    } else {
        return "Welcome";
    }
}

export function getRandomTip(): string {
    const tips = [
        "Right-click a category to rename or delete it.",
        "Press Ctrl+K to search categories by name.",
        'Right-click "LightTask" in the sidebar to quickly log out or delete your account.'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}
