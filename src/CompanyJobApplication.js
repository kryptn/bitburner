/* Functions that handle applying for different jobs/positions in a Company */

//Determines the job that the Player should get (if any) at the current
//company
PlayerObject.prototype.applyForJob = function(entryPosType) {    
    var currCompany = "";
    if (this.companyName != "") {
        currCompany = Companies[this.companyName];
    }
    var currPositionName = "";
    if (this.companyPosition != "") {
        currPositionName = this.companyPosition.positionName;
    }
	var company = Companies[this.location]; //Company being applied to
	
    var pos = entryPosType;
    
    if (!this.isQualified(company, pos)) {
        var reqText = getJobRequirementText(company, pos);
        dialogBoxCreate("Unforunately, you do not qualify for this position<br>" + reqText);
        return;
    }
    
    while (true) {
        if (Engine.Debug) {console.log("Determining qualification for next Company Position");}
        var newPos = getNextCompanyPosition(pos);
        
        if (newPos == null) {
            if (Engine.Debug) {
                console.log("Player already at highest position, cannot go any higher");
            }
            break;
        }
        
        //Check if this company has this position
        if (company.hasPosition(newPos)) {
            if (!this.isQualified(company, newPos)) {
                //If player not qualified for next job, break loop so player will be given current job
                break;
            }
            pos = newPos;
        } else {
            break;
        }
        
    }
    
    //Check if the determined job is the same as the player's current job
    if (currCompany != "") {
        if (currCompany.companyName == company.companyName &&
            pos.positionName == currPositionName) {
            var nextPos = getNextCompanyPosition(pos);
            var reqText = getJobRequirementText(company, nextPos);
            dialogBoxCreate("Unfortunately, you do not qualify for a promotion<br>" + reqText);
            
            return; //Same job, do nothing
        }
    }
    
	
    //Lose reputation from a Company if you are leaving it for another job
    var leaveCompany = false;
    var oldCompanyName = "";
    if (currCompany != "") {
        if (currCompany.companyName != company.companyName) {
            leaveCompany = true;
            oldCompanyName = currCompany.companyName;
            company.playerReputation -= 1000;
            if (company.playerReputation < 0) {company.playerReputation = 0;}
            if (Engine.debug) {
                console.log("Lost reputation for " + company.companyName + ". It is now " + company.playerReputation);
            }
        }
    }
	
    this.companyName = company.companyName;
    this.companyPosition = pos;
    
    if (leaveCompany) {
        dialogBoxCreate("Congratulations! You were offered a new job at " + this.companyName + " as a " + 
                        pos.positionName + "!<br>" + 
                        "You lost 1000 reputatation at your old company " + oldCompanyName + " because you left.");    
    } else {
        dialogBoxCreate("Congratulations! You were offered a new job at " + this.companyName + " as a " + pos.positionName + "!");
    }
    
    Engine.loadLocationContent();
}

function getJobRequirementText(company, pos) {
    var reqText = "";
    var offset = company.jobStatReqOffset;
    var reqHacking = pos.requiredHacking > 0       ? pos.requiredHacking+offset   : 0;
    var reqStrength = pos.requiredStrength > 0     ? pos.requiredStrength+offset  : 0;
    var reqDefense = pos.requiredDefense > 0       ? pos.requiredDefense+offset   : 0;
    var reqDexterity = pos.requiredDexterity > 0   ? pos.requiredDexterity+offset : 0;
    var reqAgility = pos.requiredDexterity > 0     ? pos.requiredDexterity+offset : 0;
    var reqCharisma = pos.requiredCharisma > 0     ? pos.requiredCharisma+offset  : 0;
    var reqRep = pos.requiredReputation;
    var reqText = "(Requires ";
    if (reqHacking > 0)     {reqText += (reqHacking +       " hacking, ");}
    if (reqStrength > 0)    {reqText += (reqStrength +      " strength, ");}
    if (reqDefense > 0)     {reqText += (reqDefense +       " defense, ");}
    if (reqDexterity > 0)   {reqText += (reqDexterity +     " dexterity, ");}
    if (reqAgility > 0)     {reqText += (reqAgility +       " agility, ");}
    if (reqCharisma > 0)    {reqText += (reqCharisma +      " charisma, ");}
    if (reqRep > 1)         {reqText += (reqRep +           " reputation, ");}
    reqText = reqText.substring(0, reqText.length - 2);
    reqText += ")";
    return reqText;
}

PlayerObject.prototype.applyForSoftwareJob = function() {
    this.applyForJob(CompanyPositions.SoftwareIntern);
}

PlayerObject.prototype.applyForSoftwareConsultantJob = function() {
    this.applyForJob(CompanyPositions.SoftwareConsultant);
}

PlayerObject.prototype.applyForItJob = function() {
	this.applyForJob(CompanyPositions.ITIntern);
}

PlayerObject.prototype.applyForSecurityEngineerJob = function() {
    var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.SecurityEngineer)) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.SecurityEngineer;
        dialogBoxCreate("Congratulations, you were offered a position at ", this.companyName, " as a Security Engineer!");
        Engine.loadLocationContent();
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForNetworkEngineerJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.NetworkEngineer)) {
        this.applyForJob(CompanyPositions.NetworkEngineer);
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForBusinessJob = function() {
	this.applyForJob(CompanyPositions.BusinessIntern);
}

PlayerObject.prototype.applyForBusinessConsultantJob = function() {
    this.applyForJob(CompanyPositions.BusinessConsultant);
}

PlayerObject.prototype.applyForSecurityJob = function() {
    //TODO If case for POlice departments
	this.applyForJob(CompanyPositions.SecurityGuard);
}

PlayerObject.prototype.applyForAgentJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.FieldAgent)) {
        this.applyForJob(CompanyPositions.FieldAgent);
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForEmployeeJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.Employee)) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.Employee;
        dialogBoxCreate("Congratulations, you are now employed at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForPartTimeEmployeeJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.PartTimeEmployee)) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.PartTimeEmployee;
        dialogBoxCreate("Congratulations, you are now employed part-time at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForWaiterJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.Waiter)) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.Waiter;
        dialogBoxCreate("Congratulations, you are now employed as a waiter at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

PlayerObject.prototype.applyForPartTimeWaiterJob = function() {
	var company = Companies[this.location]; //Company being applied to
    if (this.isQualified(company, CompanyPositions.PartTimeWaiter)) {
        this.companyName = company.companyName;
        this.companyPosition = CompanyPositions.PartTimeWaiter;
        dialogBoxCreate("Congratulations, you are now employed as a part-time waiter at " + this.companyName);
        Engine.loadLocationContent();
    } else {
        dialogBoxCreate("Unforunately, you do not qualify for this position");
    }
}

//Checks if the Player is qualified for a certain position
PlayerObject.prototype.isQualified = function(company, position) {
	var offset = company.jobStatReqOffset;
    var reqHacking = position.requiredHacking > 0       ? position.requiredHacking+offset   : 0;
    var reqStrength = position.requiredStrength > 0     ? position.requiredStrength+offset  : 0;
    var reqDefense = position.requiredDefense > 0       ? position.requiredDefense+offset   : 0;
    var reqDexterity = position.requiredDexterity > 0   ? position.requiredDexterity+offset : 0;
    var reqAgility = position.requiredDexterity > 0     ? position.requiredDexterity+offset : 0;
    var reqCharisma = position.requiredCharisma > 0     ? position.requiredCharisma+offset  : 0;
    
	if (this.hacking_skill >= reqHacking &&
		this.strength 	   >= reqStrength &&
        this.defense       >= reqDefense && 
        this.dexterity     >= reqDexterity &&
        this.agility       >= reqAgility &&
        this.charisma      >= reqCharisma &&
        company.playerReputation >= position.requiredReputation) {
            return true;
    }
    return false;
}