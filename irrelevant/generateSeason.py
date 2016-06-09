#!/usr/bin/python
import sys, json

if __name__ == "__main__":
    season = int(sys.argv[1])
    f = open("POI_s%d.csv"%season,"r")
    lines = f.readlines()
    f.close()
    
    seasonData = []
    
    metadata = {}
    lineData = lines[0].strip().split(',')
    metadata["numLines"] = int(lineData[1])
    metadata["lineNames"] = list(lines[1].strip().split(',')[1:])
    metadata["lineColors"] = list(lines[2].strip().split(',')[1:])
    metadata["boxColors"] = list(lines[3].strip().split(',')[1:])
    seasonData.append(metadata)

    titles = list(lines[4].strip().split(',')[1:])
    numEpisodes = len(titles)

    for i in range(5,5+numEpisodes,1):
        episode = {}
        episode["title"] = titles[i-5]
        episode["events"] = list(lines[i].strip().split(',')[1:])
        seasonData.append(episode)
        pass

    f = open("loadS%d.js"%season,"w")
    f.write("""
    function loadS1(){
    loadSeason(%s,1);
    }
    """ % json.dumps(seasonData))
    f.close()

    pass
