export const formatMessageDate = (dateString: string): string => {
    const date = new Date(dateString);
    const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const jourSemaine = jours[date.getDay()];
    const jourMois = date.getDate();
    const heure = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${jourSemaine} ${jourMois} - ${heure}:${minutes}`;
};
