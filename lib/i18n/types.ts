export type Dictionary = {
  nav: {
    appName: string;
    howToUse: string;
  };
  hero: {
    title: string;
    subtitle: string;
    exportBtn: string;
    exporting: string;
  };
  scene: {
    title: string;
    subtitle: string;
    clock: string;
    chatDate: string;
    headerStatus: string;
    contact: string;
    brand: string;
    name: string;
    avatarLetter: string;
    avatarImage: string;
    upload: string;
    wallpaper: string;
    backgroundImage: string;
  };
  composer: {
    title: string;
    subtitle: string;
    addText: string;
    addImage: string;
    sender: string;
    quickTextDraft: string;
    quickTextPlaceholder: string;
    outgoing: string;
    incoming: string;
    message: string;
    time: string;
    messageText: string;
    imageUrl: string;
  };
  preview: {
    label: string;
    title: string;
  };
  footer: {
    disclaimer: string;
    copyright: string;
    madeWith: string;
  };
  howToUse: {
    title: string;
    subtitle: string;
    steps: {
      title: string;
      description: string;
    }[];
    backToBuilder: string;
  };
  defaults: {
    newMessage: string;
    newImage: string;
  };
  initialMessages: {
    senderId: string;
    kind: string;
    text: string;
    time: string;
  }[];
};
