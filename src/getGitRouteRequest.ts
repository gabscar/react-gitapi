import { Octokit } from "@octokit/rest";
import { useState, useEffect } from "react";
/*

Introdução: https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api?apiVersion=2022-11-28&tool=javascript
Pegar commits: https://docs.github.com/pt/rest/commits/commits?apiVersion=2022-11-28
Pegar repositórios usuário autenticado: https://docs.github.com/pt/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-the-authenticated-user
pegar usuário autenticado: https://docs.github.com/pt/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
*/
const octokit = new Octokit({
    auth: "",
    userAgent: "Luby GP",
});
export default function UseOctokit() {
    const [code, setCode] = useState<any>(null);

    const getUser = async () => {
        const user = await octokit.request("GET /user", {});
        return user.data.login;
    };
    // const getUserRepo = async () => {
    //     const result = await octokit.request(
    //         "GET /users/{username}/repos{?type,sort,direction,per_page,page}",
    //         {
    //             username: await getUser(),
    //             sort: "pushed",
    //             direction: "desc",
    //         }
    //     );
    //     console.log("repoList", result.data);
    // };

    const getRepoCommit = async (owner: string, repo: string) => {
        const response = await octokit.request(
            "GET /repos/{owner}/{repo}/commits{?sha,path,author,since,until,per_page,page}",
            {
                owner,
                repo,
                author: await getUser(),
                since: "2022-12-14T16:00:49Z",
                sha: "dev",
            }
        );
        console.log("commits", response.data);
    };
    useEffect(() => {
        async function onLoad() {
            // await getUserRepo();
            await getRepoCommit(
                "lubysoftware",
                "GestaoPessoas.MS.COLLABORATORS"
            );
            await octokit
                .request(
                    "GET /user/repos{?visibility,affiliation,type,sort,direction,per_page,page,since,before}",
                    {
                        per_page: 100,
                        visibility: "private",
                        sort: "pushed",
                        affiliation: "collaborator",
                        direction: "desc",
                    }
                )
                .then((res: any) => {
                    // console.log(res.data);

                    setCode(res.data?.content);
                })
                .catch((err) => console.log(err));
        }
        onLoad();
    }, []);
    return {
        code,
    };
}
