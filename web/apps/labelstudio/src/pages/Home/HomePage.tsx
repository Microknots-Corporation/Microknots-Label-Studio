import { IconExternal, IconFolderAdd, IconHumanSignal, IconUserAdd, IconFolderOpen } from "@humansignal/icons";
import { Button, SimpleCard, Spinner, Typography } from "@humansignal/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUpdatePageTitle } from "@humansignal/core";
import { HeidiTips } from "../../components/HeidiTips/HeidiTips";
import { useAPI } from "../../providers/ApiProvider";
import { CreateProject } from "../CreateProject/CreateProject";
import { InviteLink } from "../Organization/PeoplePage/InviteLink";
import type { Page } from "../types/Page";

const PROJECTS_TO_SHOW = 10;

const resources = [
  {
    title: "Microknots",
    url: "https://www.microknots.com/",
  },
  {
    title: "Headquarters",
    url: "https://www.google.com/search?q=microknots&sca_esv=3f626f5782a50780&ei=xhQSaayhE-G-p84P5KWX6Qg&ved=0ahUKEwisnPyrguiQAxVh38kDHeTSJY0Q4dUDCBE&uact=5&oq=microknots&gs_lp=Egxnd3Mtd2l6LXNlcnAiCm1pY3Jva25vdHMyDhAuGIAEGMcBGI4FGK8BMgIQJjIIEAAYgAQYogQyBRAAGO8FMggQABiABBiiBDIIEAAYgAQYogQyHRAuGIAEGMcBGI4FGK8BGJcFGNwEGN4EGOAE2AEBSPoHUNkEWOMGcAF4AJABAJgBaqABowKqAQMxLjK4AQPIAQD4AQGYAgSgAsYCwgIIEAAYsAMY7wXCAgsQABiABBiwAxiiBMICCRAAGIAEGAoYC8ICCxAuGIAEGMcBGK8BwgIGEAAYChgemAMAiAYBkAYFugYGCAEQARgUkgcDMi4yoAfBGbIHAzEuMrgHwgLCBwcwLjEuMi4xyAcZ&sclient=gws-wiz-serp",
  },
  {
    title: "Release Notes",
    url: "",
  },
  {
    title: "Microknots Blog",
    url: "",
  },
  {
    title: "Client Relations",
    url: "",
  },
];

const actions = [
  {
    title: "Create Project",
    icon: IconFolderAdd,
    type: "createProject",
  },
  {
    title: "Invite Members",
    icon: IconUserAdd,
    type: "inviteMembers",
  },
] as const;

type Action = (typeof actions)[number]["type"];

export const HomePage: Page = () => {
  const api = useAPI();
  const [creationDialogOpen, setCreationDialogOpen] = useState(false);
  const [invitationOpen, setInvitationOpen] = useState(false);

  useUpdatePageTitle("Home");
  const { data, isFetching, isSuccess, isError } = useQuery({
    queryKey: ["projects", { page_size: 10 }],
    async queryFn() {
      return api.callApi<{ results: APIProject[]; count: number }>("projects", {
        params: { page_size: PROJECTS_TO_SHOW },
      });
    },
  });

  const handleActions = (action: Action) => {
    return () => {
      switch (action) {
        case "createProject":
          setCreationDialogOpen(true);
          break;
        case "inviteMembers":
          setInvitationOpen(true);
          break;
      }
    };
  };

  return (
    <main className="p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_450px] gap-6">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Typography variant="headline" size="small">
               Aurelo Data Engine 👋
            </Typography>
            <Typography size="small" className="text-neutral-content-subtler">
              Developed by Microknots Corporation
            </Typography>
          </div>
          <div className="flex justify-start gap-4">
            {actions.map((action) => {
              return (
                <Button
                  key={action.title}
                  look="outlined"
                  align="center"
                  className="flex-grow-0 text-16/24 gap-2 text-primary-content text-left min-w-[250px] [&_svg]:w-6 [&_svg]:h-6 pl-2"
                  onClick={handleActions(action.type)}
                  leading={<action.icon />}
                >
                  {action.title}
                </Button>
              );
            })}
          </div>

          <SimpleCard
            title={
              data && data?.count > 0 ? (
                <>
                  Recent Projects{" "}
                  <a href="/projects" className="text-lg font-normal hover:underline">
                    View All
                  </a>
                </>
              ) : null
            }
          >
            {isFetching ? (
              <div className="h-64 flex justify-center items-center">
                <Spinner />
              </div>
            ) : isError ? (
              <div className="h-64 flex justify-center items-center">can't load projects</div>
            ) : isSuccess && data && data.results.length === 0 ? (
              <div className="flex flex-col justify-center items-center border border-primary-border-subtle bg-primary-emphasis-subtle rounded-lg h-64">
                <div
                  className={
                    "rounded-full w-12 h-12 flex justify-center items-center bg-accent-grape-subtle text-primary-icon"
                  }
                >
                  <IconFolderOpen />
                </div>
                <Typography variant="headline" size="small">
                  Create your first project with Aurelo
                </Typography>
                <Typography size="small" className="text-neutral-content-subtler">
                  Import your data and set up the labeling interface to start annotating
                </Typography>
                <Button className="mt-4" onClick={() => setCreationDialogOpen(true)} aria-label="Create new project">
                  Create Project
                </Button>
              </div>
            ) : isSuccess && data && data.results.length > 0 ? (
              <div className="flex flex-col gap-1">
                {data.results.map((project) => {
                  return <ProjectSimpleCard key={project.id} project={project} />;
                })}
              </div>
            ) : null}
          </SimpleCard>
        </section>
        <section className="flex flex-col gap-6">
          <HeidiTips collection="projectSettings" />
          <SimpleCard title="Resources" description="Learn, explore and get help" data-testid="resources-card">
            <ul>
              {resources.map((link) => {
                return (
                  <li key={link.title}>
                    <a
                      href={link.url}
                      className="py-2 px-1 flex justify-between items-center text-neutral-content"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.title}
                      <IconExternal className="text-primary-icon" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </SimpleCard>
          <div className="flex gap-2 items-center">
            <IconHumanSignal />
            <span className="text-neutral-content-subtle">Microknots Version: Community</span>
          </div>
        </section>
      </div>
      {creationDialogOpen && <CreateProject onClose={() => setCreationDialogOpen(false)} />}
      <InviteLink opened={invitationOpen} onClosed={() => setInvitationOpen(false)} />
    </main>
  );
};

HomePage.title = "Home";
HomePage.path = "/";
HomePage.exact = true;

function ProjectSimpleCard({
  project,
}: {
  project: APIProject;
}) {
  const finished = project.finished_task_number ?? 0;
  const total = project.task_number ?? 0;
  const progress = (total > 0 ? finished / total : 0) * 100;
  const white = "#FFFFFF";
  const color = project.color && project.color !== white ? project.color : "#E1DED5";

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block even:bg-neutral-surface rounded-sm overflow-hidden"
      data-external
    >
      <div
        className="grid grid-cols-[minmax(0,1fr)_150px] p-2 py-3 items-center border-l-[3px]"
        style={{ borderLeftColor: color }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-neutral-content">{project.title}</span>
          <div className="text-neutral-content-subtler text-sm">
            {finished} of {total} Tasks ({total > 0 ? Math.round((finished / total) * 100) : 0}%)
          </div>
        </div>
        <div className="bg-neutral-surface rounded-full overflow-hidden w-full h-2 shadow-neutral-border-subtle shadow-border-1">
          <div className="bg-positive-surface-hover h-full" style={{ maxWidth: `${progress}%` }} />
        </div>
      </div>
    </Link>
  );
}
