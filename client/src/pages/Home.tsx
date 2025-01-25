import HomeCard from "../components/HomeCard";
import useAuth from "../hooks/useAuth";
import { getGreeting, getRandomTip } from "../utils/utils";

export default function Home() {
    const { logOut, deleteUser } = useAuth();

    const accountButtons = [
        { title: "Log out", action: () => logOut(true) },
        { title: "Delete account", action: deleteUser }
    ];

    const githubButtons = [
        { title: "Open GitHub", action: () => open("https://github.com/EugSh1/LightTask", "_blank") }
    ];

    const profileButtons = [{ title: "Open GitHub", action: () => open("https://github.com/EugSh1", "_blank") }];

    return (
        <main className="flex flex-col justify-center items-center h-screen gap-2">
            <h1 className="text-3xl font-bold text-text">{getGreeting()}</h1>
            <div className="flex flex-wrap justify-center gap-2">
                <HomeCard
                    title="Manage account"
                    description="Log out or delete your account with a single click."
                    buttons={accountButtons}
                />
                <HomeCard title="Tips" description={getRandomTip()} buttons={[]} />
                <HomeCard
                    title="View on GitHub"
                    description="View the project's source code on GitHub."
                    buttons={githubButtons}
                />
                <HomeCard
                    title="Creator Profile"
                    description="Find out more about the author and his other projects."
                    buttons={profileButtons}
                />
            </div>
        </main>
    );
}
